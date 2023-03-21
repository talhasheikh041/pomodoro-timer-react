import { useEffect, useState } from "react"

function App() {
  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  const [isBreakStarted, setIsBreakStarted] = useState(false)
  const [isSessionPaused, setIsSessionPaused] = useState(false)
  const [isBreakPaused, setIsBreakPaused] = useState(false)
  const [sessionTimer, setSessionTimer] = useState(0)
  const [breakTimer, setBreakTimer] = useState(0)
  const [reset, setReset] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [isFirstTime, setisFirstTime] = useState(true)
  const [sessionCount, setSessionCount] = useState(0)

  const notificationSound = document.getElementById("beep")
  const startSound = document.getElementById("start-sound")

  const sessionMinutes = Math.floor(sessionTimer / 60)
  const sessionSeconds = sessionTimer % 60

  const breakMinutes = Math.floor(breakTimer / 60)
  const breakSeconds = breakTimer % 60

  useEffect(() => setSessionCount((prev) => prev + 1), [isBreakStarted])

  useEffect(() => {
    setBreakTimer(breakLength * 60)
    setSessionTimer(sessionLength * 60)
    setReset(false)
  }, [breakLength, sessionLength, reset])

  useEffect(SessionTimer, [isSessionStarted, isSessionPaused, sessionTimer])
  useEffect(BreakTimer, [isBreakStarted, isBreakPaused, breakTimer])

  function BreakTimer() {
    let timer
    if (isBreakStarted && breakTimer > 0 && !isBreakPaused) {
      timer = setTimeout(() => {
        setBreakTimer((prev) => prev - 1)
      }, 1000)
    } else if (isRunning) {
      notificationSound.currentTime = 0
      notificationSound.play()
      setSessionTimer(sessionLength * 60)
      setIsBreakStarted(false)
      setIsSessionStarted(true)
    }
    return () => clearTimeout(timer)
  }

  function SessionTimer() {
    let timer
    if (isSessionStarted && sessionTimer > 0 && !isSessionPaused) {
      timer = setTimeout(() => {
        setSessionTimer((prev) => prev - 1)
      }, 1000)
    } else if (isRunning) {
      notificationSound.currentTime = 0
      notificationSound.play()
      setBreakTimer(breakLength * 60)
      setIsSessionStarted(false)
      setIsBreakStarted(true)
    }
    return () => clearTimeout(timer)
  }

  function handleBreakLength(e) {
    if (isRunning) {
      return
    }
    if (e.target.id === "break-increment") {
      setBreakLength((prev) => {
        if (prev < 60) {
          return prev + 1
        } else {
          return prev
        }
      })
    } else {
      setBreakLength((prev) => {
        if (prev > 1) {
          return prev - 1
        } else {
          return prev
        }
      })
    }
  }

  function handleSessionLength(e) {
    if (isRunning) {
      return
    }
    if (e.target.id === "session-increment") {
      setSessionLength((prev) => {
        if (prev < 60) {
          return prev + 1
        } else {
          return prev
        }
      })
    } else {
      setSessionLength((prev) => {
        if (prev > 1) {
          return prev - 1
        } else {
          return prev
        }
      })
    }
  }

  function handleFirstStart() {
    startSound.currentTime = 0
    startSound.play()
    setisFirstTime(false)
    setIsRunning(true)
    setIsSessionStarted(true)
  }

  function handleSessionPause() {
    startSound.currentTime = 0
    startSound.play()
    setIsSessionPaused((prev) => !prev)
    setIsRunning((prev) => !prev)
  }

  function handleBreakPause() {
    startSound.currentTime = 0
    startSound.play()
    setIsBreakPaused((prev) => !prev)
    setIsRunning((prev) => !prev)
  }

  function resetTimer() {
    setBreakLength(5)
    setSessionLength(25)
    setisFirstTime(true)
    setIsSessionStarted(false)
    setIsBreakStarted(false)
    setIsSessionPaused(false)
    setIsBreakPaused(false)
    setIsRunning(false)
    setSessionCount(0)
    setReset(true)
  }

  return (
    <div className="pomodoro">
      <h1 className="title">Pomodoro Timer</h1>

      <div className="options-wrapper">
        <div className="break-container">
          <span id="break-label">Break Length</span>
          <div className="option-btn-wrapper">
            <button
              onClick={handleBreakLength}
              className="options-btn"
              id="break-increment"
            >
              +
            </button>
            <span id="break-length">{breakLength}</span>
            <button
              onClick={handleBreakLength}
              className="options-btn"
              id="break-decrement"
            >
              -
            </button>
          </div>
        </div>

        <div className="session-container">
          <span id="session-label">Session Length</span>
          <div className="option-btn-wrapper">
            <button
              onClick={handleSessionLength}
              className="options-btn"
              id="session-increment"
            >
              +
            </button>
            <span id="session-length">{sessionLength}</span>
            <button
              onClick={handleSessionLength}
              className="options-btn"
              id="session-decrement"
            >
              -
            </button>
          </div>
        </div>
      </div>

      <div className="timer-container">
        <span id="timer-label">
          {isSessionStarted
            ? "Session Started"
            : isBreakStarted
            ? "Break Started"
            : "Session"}
        </span>
        {isBreakStarted ? (
          <h1 id="time-left">
            {breakMinutes < 10 ? `0${breakMinutes}` : `${breakMinutes}`}:
            {breakSeconds < 10 ? `0${breakSeconds}` : `${breakSeconds}`}
          </h1>
        ) : (
          <h1 id="time-left">
            {sessionMinutes < 10 ? `0${sessionMinutes}` : `${sessionMinutes}`}:
            {sessionSeconds < 10 ? `0${sessionSeconds}` : `${sessionSeconds}`}
          </h1>
        )}
        <div className="timer-btn-wrapper">
          {isFirstTime && (
            <button
              onClick={handleFirstStart}
              className="timer-btn"
              id="start_stop"
            >
              Start
            </button>
          )}
          {isSessionStarted && (
            <button
              onClick={handleSessionPause}
              className="timer-btn"
              id="start_stop"
            >
              {isSessionPaused ? "Start" : "Stop"}
            </button>
          )}
          {isBreakStarted && (
            <button
              onClick={handleBreakPause}
              className="timer-btn"
              id="start_stop"
            >
              {isBreakPaused ? "Start" : "Stop"}
            </button>
          )}
          <button onClick={resetTimer} className="timer-btn" id="reset">
            Reset
          </button>
        </div>
        <span id="session-count">
          Session Count: {Math.trunc(sessionCount / 2)}
        </span>
      </div>
      <audio id="beep" src="./sounds/notification.wav"></audio>
      <audio id="start-sound" src="./sounds/start-timer.mp3"></audio>
    </div>
  )
}

export default App
