import React from 'react';

export default function SaveButton({ onSave }) {
  return (
    <button className="fixed-button" onClick={onSave}>
      Сохранить путешествие
    </button>
  );
}