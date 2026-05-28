type AmazonImageComplianceInput = {
  content: string;
  coverImage: string | null | undefined;
};

export type AmazonLinkDetectionResult = {
  hasAmazonAffiliateLinks: boolean;
  detectedAmazonLinks: string[];
};

export type AmazonImageComplianceResult = {
  hasAmazonAffiliateLinks: boolean;
  isCompliant: boolean;
  needsReview: boolean;
  reasons: string[];
  detectedAmazonLinks: string[];
  expectedProductImages: string[];
};

const AMAZON_HOST_PATTERNS = ["amazon.", "amzn.to"];
const AMAZON_IMAGE_HOST_PATTERNS = [
  "m.media-amazon.com",
  "images-na.ssl-images-amazon.com",
];
const AMAZON_IMAGE_URL_REGEX = /https:\/\/(?:m\.media-amazon\.com|images-na\.ssl-images-amazon\.com)\/images\/I\/[^"'\s)<>]+/gi;

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s"'<>]+/gi) ?? [];
  return Array.from(new Set(matches.map((url) => url.replace(/[),.;]+$/, ""))));
}

function isAmazonAffiliateUrl(url: string): boolean {
  const normalized = url.toLowerCase();
  if (normalized.includes("amzn.to/")) return true;
  if (!AMAZON_HOST_PATTERNS.some((pattern) => normalized.includes(pattern))) {
    return false;
  }
  return normalized.includes("/dp/") || normalized.includes("/gp/product/");
}

export function detectAmazonAffiliateLinks(content: string): AmazonLinkDetectionResult {
  const urls = extractUrls(content);
  const amazonLinks = urls.filter(isAmazonAffiliateUrl);
  return {
    hasAmazonAffiliateLinks: amazonLinks.length > 0,
    detectedAmazonLinks: amazonLinks,
  };
}

function isAmazonProductImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return AMAZON_IMAGE_HOST_PATTERNS.some((host) => parsed.hostname.includes(host));
  } catch {
    return false;
  }
}

function normalizeAmazonImageIdentifier(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    // Amazon usa variações como ._SY342_ antes da extensão; removemos para comparar o mesmo ativo.
    return path.replace(/\._[^/.]+(?=\.[a-z0-9]+$)/i, "");
  } catch {
    return url.toLowerCase();
  }
}

async function fetchAmazonExpectedImage(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    const html = await response.text();
    const candidates = Array.from(new Set(html.match(AMAZON_IMAGE_URL_REGEX) ?? []));

    if (candidates.length === 0) return null;

    // Prioriza URLs que pareçam imagem de produto principal (sem thumbnail explícita).
    const primary = candidates.find((img) => !img.toLowerCase().includes("thumb"));
    return primary ?? candidates[0] ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function validateAmazonAffiliateImageCompliance(
  input: AmazonImageComplianceInput,
): Promise<AmazonImageComplianceResult> {
  const detection = detectAmazonAffiliateLinks(input.content);
  const amazonLinks = detection.detectedAmazonLinks;

  if (amazonLinks.length === 0) {
    return {
      hasAmazonAffiliateLinks: false,
      isCompliant: true,
      needsReview: false,
      reasons: [],
      detectedAmazonLinks: [],
      expectedProductImages: [],
    };
  }

  const reasons: string[] = [];
  const coverImage = input.coverImage ?? "";

  if (!coverImage || !coverImage.trim()) {
    reasons.push("Conteúdo com link Amazon sem imagem de capa definida.");
  }

  if (coverImage && !isAmazonProductImageUrl(coverImage)) {
    reasons.push(
      "Conteúdo com link Amazon exige imagem original do produto hospedada em domínio de mídia da Amazon.",
    );
  }

  const expectedImagesRaw = await Promise.all(
    amazonLinks.slice(0, 2).map((link) => fetchAmazonExpectedImage(link)),
  );
  const expectedImages = Array.from(
    new Set(expectedImagesRaw.filter((img): img is string => Boolean(img))),
  );

  if (expectedImages.length === 0) {
    reasons.push(
      "Não foi possível validar automaticamente a imagem principal do produto no link Amazon. Revisão manual obrigatória.",
    );
  } else if (coverImage) {
    const normalizedCover = normalizeAmazonImageIdentifier(coverImage);
    const expectedNormalized = expectedImages.map(normalizeAmazonImageIdentifier);
    const matched = expectedNormalized.includes(normalizedCover);

    if (!matched) {
      reasons.push(
        "A imagem de capa não corresponde à imagem principal do produto do link Amazon validado.",
      );
    }
  }

  return {
    hasAmazonAffiliateLinks: true,
    isCompliant: reasons.length === 0,
    needsReview: reasons.length > 0,
    reasons,
    detectedAmazonLinks: amazonLinks,
    expectedProductImages: expectedImages,
  };
}
