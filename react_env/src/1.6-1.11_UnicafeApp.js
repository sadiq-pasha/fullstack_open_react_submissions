import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={(e) => props.handleClick(e, props.text)}>{props.text}</button>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const numberOfGoodReviews = props.value.filter((element) => element === 'good').length
  const numberOfNeutralReviews = props.value.filter((element) => element === 'neutral').length
  const numberOfBadReviews = props.value.filter((element) => element === 'bad').length
  const mantissaLength = 3
  const averageReview = Math.trunc(((numberOfGoodReviews-numberOfBadReviews)/props.value.length) * Math.pow(10, mantissaLength)) / Math.pow(10, mantissaLength)
  const positiveReview = Math.trunc((((numberOfGoodReviews)/props.value.length)*100) * Math.pow(10, mantissaLength)) / Math.pow(10, mantissaLength)
  if (props.value.length === 0){
    return (
      <div>
        No feedback given
      </div>
    )
  }
  else {
    return (
      <table>
        <StatisticLine text="good" value={numberOfGoodReviews}/>
        <StatisticLine text="neutral" value={numberOfNeutralReviews}/>
        <StatisticLine text="bad" value={numberOfBadReviews}/>
        <StatisticLine text="all" value={props.value.length}/>
        <StatisticLine text="average" value={averageReview}/>
        <StatisticLine text="positive" value={`${positiveReview}%`}/>
      </table>
    )
  }
}


const UnicafeApp = () => {
  const [feedbackArray, setFeedbackArray] = useState([])

  const changeFeedbackArray = (e, newValue) => {
    console.log(e)
    if (newValue === 'reset') {
      setFeedbackArray([])
    } else {
      setFeedbackArray(feedbackArray.concat(newValue))
    }
  }

  return (
    <div>
      <h2>UNICAFE</h2>
      <h3>give feedback</h3>
      <Button handleClick={changeFeedbackArray} text="good"/>
      <Button handleClick={changeFeedbackArray} text="neutral"/>
      <Button handleClick={changeFeedbackArray} text="bad"/>
      <Button handleClick={changeFeedbackArray} text="reset"/>
      <h3>statistics</h3>
      <Statistics value={feedbackArray}/>
    </div>
  )
}

export default UnicafeApp