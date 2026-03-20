// Teste OpenAI TTS (Groq playai-tts foi desativado em mar/2026)
// Executar: node --env-file=.env.local scripts/test-groq-tts.mjs
import OpenAI from 'openai'
import fs from 'fs'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

console.log('OPENAI_API_KEY presente:', !!process.env.OPENAI_API_KEY)

try {
  console.log('\nTestando OpenAI TTS (tts-1, voz nova)...')
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova',
    input: 'Olá! Sou o assistente do I R P F N S B. Posso te ajudar com sua declaração de imposto de renda.',
    speed: 1.05,
  })
  const buffer = Buffer.from(await mp3.arrayBuffer())
  fs.writeFileSync('test-audio-openai.mp3', buffer)
  console.log('✅ Sucesso! Arquivo gerado: test-audio-openai.mp3 (' + buffer.length + ' bytes)')
} catch (err) {
  console.error('❌ Erro:', err.message)
  console.error('Status:', err.status)
}

console.log('GROQ_API_KEY presente:', !!process.env.GROQ_API_KEY)

// Vozes para testar em ordem
const voices = ['Fritz-PlayAI', 'Celeste-PlayAI', 'Aaliya-PlayAI', 'Arista-PlayAI']

for (const voice of voices) {
  try {
    console.log(`\nTestando voz: ${voice}`)
    const response = await groq.audio.speech.create({
      model: 'playai-tts',
      voice,
      input: 'Olá, este é um teste de voz do assistente IRPF NSB.',
      response_format: 'mp3'
    })

    const buffer = Buffer.from(await response.arrayBuffer())
    const filename = `test-audio-${voice}.mp3`
    fs.writeFileSync(filename, buffer)
    console.log(`✅ Sucesso com ${voice}! Arquivo: ${filename} (${buffer.length} bytes)`)
    break // Para no primeiro que funcionar
  } catch (err) {
    console.error(`❌ Erro com ${voice}:`)
    console.error('  message:', err.message)
    console.error('  status:', err.status)
    if (err.error) console.error('  detalhes:', JSON.stringify(err.error, null, 2))
  }
}

// Listar modelos disponíveis
console.log('\n--- Modelos TTS disponíveis no Groq ---')
try {
  const models = await groq.models.list()
  const ttsModels = models.data.filter(m =>
    m.id.toLowerCase().includes('tts') ||
    m.id.toLowerCase().includes('playai') ||
    m.id.toLowerCase().includes('audio') ||
    m.id.toLowerCase().includes('whisper')
  )
  if (ttsModels.length > 0) {
    ttsModels.forEach(m => console.log(' -', m.id))
  } else {
    console.log('Nenhum modelo TTS encontrado. Todos os modelos:')
    models.data.forEach(m => console.log(' -', m.id))
  }
} catch (err) {
  console.error('Erro ao listar modelos:', err.message)
}
