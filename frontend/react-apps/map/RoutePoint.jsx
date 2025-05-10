import React, {useState, useEffect, useRef} from 'react';
import {useTimer} from './useTimer';
import {currencies} from './TotalPrice';

export default function RoutePoint({location, i, timeData, data, onPointUpdate, prevTypic, initialPointsCount}) {
    const timeInfo = timeData.find(item => item.id === i) || {};
    const displayTime = useTimer(timeInfo.time);

    const [editMode, setEditMode] = useState(i >= initialPointsCount);
    const [formData, setFormData] = useState({
        loc: location === '!' ? null : location,
        typic: data.typic?.[i] === '!' ? null : (data.typic?.[i] || 'poliline'),
        date_to: data.date_to?.[i] === '!' ? null : (data.date_to?.[i] || ''),
        date_out: data.date_out?.[i] === '!' ? null : (data.date_out?.[i] || ''),
        air: data.air?.[i] === '!' ? null : (data.air?.[i] || ''),
        air2: data.air2?.[i] === '!' ? null : (data.air2?.[i] || ''),
        icao: data.icao?.[i] === '!' ? null : (data.icao?.[i] || ''),
        icao2: data.icao2?.[i] === '!' ? null : (data.icao2?.[i] || ''),
        gost: data.gost?.[i] === '!' ? null : (data.gost?.[i] || ''),
        cost: data.cost?.[i] === '!' ? null : (data.cost?.[i] ? data.cost[i].split('-')[0] : ''),
        rec: data.rec?.[i] === '!' ? null : (data.rec?.[i] || ''),
        currency: data.cost?.[i] === '!' ? null : (data.cost?.[i] ? data.cost[i].split('-')[1] || 'USD' : 'USD'),
    });

    // Проверка на заглушки и undefined
    const hasAirport = formData.air && formData.air !== '!' && formData.air !== undefined;
    const hasAirportOut = formData.air2 && formData.air2 !== '!' && formData.air2 !== undefined;
    const hasIcao = formData.icao && formData.icao !== '!' && formData.icao !== undefined;
    const hasIcao2 = formData.icao2 && formData.icao2 !== '!' && formData.icao2 !== undefined;
    const hasDateTo = formData.date_to && formData.date_to !== '!' && formData.date_to !== undefined;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSave = () => {
        setEditMode(false);
        const updatedData = {
            loc: formData.loc,
            typic: formData.typic,
            date_to: formData.date_to,
            date_out: formData.date_out,
            air: (prevTypic === 'poliline') ? formData.air : null,
            air2: formData.typic === 'poliline' ? formData.air2 : null,
            icao: (prevTypic === 'poliline') ? formData.icao : null,
            icao2: formData.typic === 'poliline' ? formData.icao2 : null,
            gost: formData.gost,
            cost: `${formData.cost}-${formData.currency}`,
            rec: formData.rec,
        };
        onPointUpdate(i, updatedData);
    };

    const calculateDaysDifference = (dateFrom, dateTo) => {
        if (!dateFrom || !dateTo) return null;

        const start = new Date(dateFrom);
        const end = new Date(dateTo);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : null;
    };

    if (editMode) {
        return (
            <div className="route-point" key={`point-${i}`}>
                <div className="point-header">
                    <h3>
                        📍 {location || 'Не указано'}
                        <p className={`rater-${i} time-displayer`} style={{color: timeInfo.error ? 'red' : 'inherit'}}>
                            ⏰ {timeInfo.error ? 'Ошибка получения времени' : displayTime}
                        </p>
                    </h3>
                </div>

                <div>
                    <span className="label">Способ передвижения:</span>
                    <select name="typic" value={formData.typic} onChange={handleChange}>
                        <option value="poliline" selected>poliline</option>
                        <option value="car">car</option>
                    </select>
                </div>

                <div className="point-dates">
                    <div>
                        <span className="label">Прибытие:</span>
                        <input
                            type="date"
                            name="date_to"
                            value={formData.date_to}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <span className="label">Отбытие:</span>
                        <input
                            type="date"
                            name="date_out"
                            value={formData.date_out}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {(prevTypic === 'poliline') && (
                    <>
                        <div>
                            <span className="label">Аэропорт прилета:</span>
                            <input
                                type="text"
                                name="air"
                                value={formData.air}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <span className="label">ICAO код прилета:</span>
                            <input
                                type="text"
                                name="icao"
                                value={formData.icao}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {formData.typic === 'poliline' &&
                    (<>
                        <div>
                            <span className="label">Аэропорт вылета:</span>
                            <input
                                type="text"
                                name="air2"
                                value={formData.air2}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <span className="label">ICAO код вылета:</span>
                            <input
                                type="text"
                                name="icao2"
                                value={formData.icao2}
                                onChange={handleChange}
                            />
                        </div>
                    </>)
                }

                <div className="hotel-label">
                    <span className="label">Гостиница:</span>
                    <input
                        type="text"
                        name="gost"
                        value={formData.gost}
                        onChange={handleChange}
                    />
                </div>

                <div className="point-price">
                    <span className="label">Стоимость:</span>
                    <input
                        type="text"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                    />
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                    >
                        {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>
                                {currency.code}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!formData.date_to || !formData.date_out}
                    className="save-btn"
                >
                    Сохранить
                </button>
            </div>
        );
    }

    return (
        <div className="route-point" key={`point-${i}`}>
            <div className="point-header">
                <h3>
                    📍 {location || 'Не указано'}
                    <p className={`rater-${i} time-displayer`} style={{color: timeInfo.error ? 'red' : 'inherit'}}>
                        ⏰ {timeInfo.error ? 'Ошибка получения времени' : displayTime}
                    </p>
                </h3>
                {hasDateTo && (
                    <span className="badge">
            Расчёт дней: {calculateDaysDifference(formData.date_to, formData.date_out) || 'N/A'}
          </span>
                )}
            </div>
            <div>Способ передвижения - {formData.typic || 'Не указано'}</div>

            <div className="point-dates">
                {hasDateTo && (
                    <div>
                        <span className="label">Прибытие:</span>
                        <span className="value">{formData.date_to}</span>
                    </div>
                )}
                <div>
                    <span className="label">Отбытие:</span>
                    <span className="value">{formData.date_out || 'Не указано'}</span>
                </div>
            </div>

            {(prevTypic === 'poliline') && hasAirport && (
                <div>
                    <span className="label">Аэропорт прилета:</span>
                    <span className="value">{formData.air}</span>
                </div>
            )}

            {(prevTypic === 'poliline') && hasIcao && (
                <div>
                    <span className="label">ICAO код прилета:</span>
                    <span className="value">{formData.icao}</span>
                </div>
            )}

            {hasAirportOut && formData.typic === 'poliline' && (
                <div>
                    <span className="label">Аэропорт вылета:</span>
                    <span className="value">{formData.air2}</span>
                </div>
            )}

            {hasIcao2 && formData.typic === 'poliline' && (
                <div>
                    <span className="label">ICAO код вылета:</span>
                    <span className="value">{formData.icao2}</span>
                </div>
            )}

            <div className="hotel-label">
                <span className="label">Гостиница:</span>
                <span className="value">{formData.gost || 'Не указано'}</span>
            </div>

            <div className="point-price">
                <span className="label">Стоимость:</span>
                <span className="value">{formData.cost && formData.currency
                    ? `${formData.cost}-${formData.currency}`
                    : '0-USD'}</span>
            </div>

            {data.rec?.[i] && (
                <a href={data.rec[i]} className="booking-btn">Забронировать гостиницу →</a>
            )}
        </div>
    );
}