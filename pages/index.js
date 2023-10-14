import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredient: ingredientInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setIngredientInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Girl Dinner Generator</title>
        <link rel="icon" href="/patrick.png" />
      </Head>

      <main className={styles.main}>
        <img src="/patrick.png" className={styles.icon} />
        <h3>Girl Dinner Generator</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="ingredient"
            placeholder="Enter a food item, e.g. Oat Milk"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
          />
          <input type="submit" value="Let's Gooo" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
