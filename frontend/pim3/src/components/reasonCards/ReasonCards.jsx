import React from 'react'
import reasonCardsDB from './reasonCardsDB.jsx'

import styles from './reasonCards.module.css'

export function ReasonCards() {
  return (
    <div>
        {reasonCardsDB.map((card) => (
          <div key={card.id} className={styles.container}>
            <img src={card.img} alt="" />
            <p>{card.text}</p>
          </div>
        ))}
    </div>
  )
}