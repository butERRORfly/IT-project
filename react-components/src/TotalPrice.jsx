export default function TotalPrice({ totalScore }) {
  return (
    <div class="summ-price">
        <div>
            <span class="label">💵 Полная стоимость:</span>
            <span class="value">{totalScore} USD</span>
        </div>
        А тут наверное выпадающий список валют?
    </div>
  );
}