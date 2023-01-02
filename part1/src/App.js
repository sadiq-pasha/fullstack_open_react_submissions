import { useState } from "react";

const Button = (props) => {
  return (
    <>
      <button onClick={() => props.onClick(props.currentState,props.setFunction,props.text)}>{props.text}</button>
    </>
  )
}

const Display = (props) => {
  return (
    <>
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
      <p>all {props.reviews.length}</p>
      <p>average {props.averageReviewScore}</p>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [reviews, setReviews] = useState([])
  const [averageReviewScore,setaverageReviewScore] = useState(0)

  const handleClick = (currentState,setFunction,buttonName) => {
    setReviews(reviews.concat(buttonName))
    setFunction(currentState + 1)
    // console.log(reviews)
    setaverageReviewScore(reviews.filter((review) => review === "good"))
    // console.log(averageReviewScore)
  }
  console.log(reviews)
  
  return (
    <>
      <div>
        <h1>give feedback</h1>
      </div>
      <div>
        <Button text="good" onClick={handleClick} currentState={good} setFunction={setGood}/>
        <Button text="neutral" onClick={handleClick} currentState={neutral} setFunction={setNeutral}/>
        <Button text="bad" onClick={handleClick} currentState={bad} setFunction={setBad}/>
        <h1>statistics</h1>
        <Display good={good} neutral={neutral} bad={bad} reviews={reviews} averageReviewScore={averageReviewScore}/>
      </div>
    </>
  )
}

export default App