import ScriptLoader from './ScriptLoader';
import './priceSelector.css'

export default function TotalPrice({ totalScore }) {
  return (
    <div class="summ-price">
        <div>
            <span class="label">💵 Полная стоимость:</span>
            <p2 id="rater">USD</p2>
            <span id = 'summary' class="value">{totalScore}</span>
        </div>
        <select id="selector" class="select-container"></select>
        <ScriptLoader src="/src/adapters/entrypoints/static/rate.js" />
    </div>
  );
}