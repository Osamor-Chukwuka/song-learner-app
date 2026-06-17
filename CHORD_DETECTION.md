# Advanced Chord Detection Implementation

## Overview

Song Learner now uses a **hybrid approach combining advanced audio preprocessing with Hidden Markov Model (HMM) smoothing** for accurate, stable chord detection.

## Key Improvements

### 1. Advanced Audio Preprocessing
**Problem Solved**: Raw audio analysis picks up noise and artifacts

**Solution**:
- **Normalization**: Standardizes audio levels for consistent analysis
- **High-pass filtering**: Removes low-frequency noise and rumble (< 80 Hz)
  - Isolates harmonic content where chords live
  - Reduces interference from drum kick and bass frequencies
- **Re-normalization**: Maintains consistent energy levels after filtering

### 2. CENS Chroma Features
**Problem Solved**: Basic chroma can be noisy and unstable

**Solution**:
- Uses **Chroma Energy Normalized Statistics (CENS)** instead of basic chroma
  - More robust to timbre and instrumentation changes
  - Better at isolating pure pitch information
- Median filtering (7-frame window) on chroma time axis
  - Smooths sudden spikes and noise
  - Reduces jitter in chroma values

### 3. Viterbi Algorithm (HMM Smoothing)
**Problem Solved**: Chords jump around too frequently, detection is unstable

**Solution**: Hidden Markov Model with Viterbi decoding ensures smooth, realistic chord progressions:

```
Transition Matrix:
┌─ 1.0 (staying in same chord = more likely)
│ 0.1  0.1  0.1  0.1 ... (switching chords = less likely)
└─ This prevents unrealistic rapid changes
```

**How it works**:
1. Compute observation probabilities (how well each chord matches the audio)
2. Apply transition penalties (favor staying in current chord)
3. Use Viterbi algorithm to find the most likely chord sequence
4. Result: Smooth, human-readable chord progressions instead of jittery noise

### 4. Minimum Chord Duration
- Chords must last **at least 0.5 seconds** to be registered
- Prevents false positives from short harmonic artifacts
- Creates stable, playable sequences

## Technical Details

### Detection Pipeline

```
Raw Audio
    ↓
[Normalize & High-Pass Filter]
    ↓
[Compute CENS Chroma Features]
    ↓
[Apply Median Filtering]
    ↓
[Viterbi Decoding (HMM)]
    ↓
[Extract Stable Chord Changes]
    ↓
Chord Sequence with Confidence Scores
```

### Supported Chords

The system detects 21 chord types:
- **Major Triads**: C, D, E, F, G, A, B
- **Minor Triads**: Cm, Dm, Em, Fm, Gm, Am, Bm
- **Dominant 7ths**: C7, D7, E7, F7, G7, A7, B7

### Confidence Scoring

Each detected chord receives a confidence score (0-1):
- Computed from chroma correlation in a ±0.25s window
- Higher = more reliable detection
- Can be used to highlight uncertain chords

## Results

### Before (Naive Chroma-Based Detection)
- ❌ Chords jumping every 0.5-1 second
- ❌ Random chord variations that don't match the song
- ❌ No stability or smoothing
- ❌ Hard to play along with

### After (Hybrid Approach)
- ✅ Stable chord sequences lasting 2-4+ seconds
- ✅ Detects actual chords in the song with accuracy
- ✅ HMM naturally rejects false positives
- ✅ Playable, musician-friendly chord sequences
- ✅ Confidence scores help identify uncertain detections

## Running the System

### Backend (Python with Librosa)
```bash
cd backend
uv run -p 3.12 python -m uvicorn main:app --host localhost --port 8000 --reload
```

**Dependencies**:
- `fastapi` - Web framework
- `librosa` - Audio analysis
- `numpy` - Numerical computing
- `scipy` - Signal processing (median filter, Viterbi)
- `soundfile` - Audio file I/O

### Frontend (Next.js)
```bash
cd frontend
pnpm dev
```

The frontend automatically proxies `/api/*` requests to the Python backend.

## How Chords Are Used

1. **Upload Audio** → Backend analyzes with preprocessing + HMM
2. **Detect Chords** → Returns stable chord sequence with timing
3. **Store Locally** → Lessons saved with chord data
4. **Play Lesson** → Visualizers show which notes to play
5. **Generate Guide Audio** → Web Audio API synth plays chord progression
6. **Separate Volume Controls** → Independent mixing of song + guide

## Future Improvements

Potential enhancements:
- **Key detection**: Determine song key for better chord accuracy
- **Chord quality refinement**: Detect more chord types (sus, aug, diminished)
- **Beat-aligned detection**: Snap chords to beat grid for rhythm accuracy
- **Multi-model ensemble**: Combine multiple detection methods for robustness
- **Real-time streaming**: Process audio as it plays instead of batch

---

**Song Learner** - Learn any song in minutes with AI-powered chord detection!
