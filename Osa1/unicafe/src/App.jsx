import { useState } from 'react'

const Statistics = (props) => {
  console.log(props)
  const total = props.good + props.neutral + props.bad
  const average = (props.good * 1 + props.neutral * 0 + props.bad * -1) / total
  const positive = props.good / total * 100 + " %"

  if (total === 0) {
    return (
      <p>No feedback given.</p>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticLine text='Good' value={props.good}/>
        <StatisticLine text='Neutral' value={props.neutral} />
        <StatisticLine text='Bad' value={props.bad} />
        <StatisticLine text='All' value={total} />
        <StatisticLine text='Average' value={average} />
        <StatisticLine text='Positive' value={positive} />
      </tbody>
    </table>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text='Good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='Neutral' />
      <Button onClick={() => setBad(bad + 1)} text='Bad' />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App