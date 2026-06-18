export async function POST(request: Request) {
  try {
    // Read the FormData from the request
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json(
        {
          success: false,
          error: 'No file provided',
          chords: [],
          sections: [],
        },
        { status: 400 }
      )
    }

    console.log('[v0] Received file for analysis:', file.name, file.size, 'bytes')

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create new FormData for the backend
    const backendFormData = new FormData()
    backendFormData.append('file', new Blob([buffer], { type: file.type }), file.name)

    console.log('[v0] Forwarding to Python backend...')

    // Forward to the Python backend on 127.0.0.1
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000'
    console.log('[v0] Backend URL:', backendUrl)
    
    const backendResponse = await fetch(`${backendUrl}/analyze-audio`, {
      method: 'POST',
      body: backendFormData,
      timeout: 120000, // 2 minute timeout for analysis
    })

    console.log('[v0] Backend response status:', backendResponse.status)

    // Return the response from the backend
    const data = await backendResponse.json()
    console.log('[v0] Returning data to frontend')
    return Response.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error('[v0] API error:', error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        chords: [],
        sections: [],
      },
      { status: 500 }
    )
  }
}
