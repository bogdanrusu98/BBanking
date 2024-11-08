// src/components/IbanGenerator.jsx
import React, { useState } from 'react';

function IbanGenerator() {

    const prefix = 'RO69 BROP';
    const randomNumbers = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
    const formattedNumbers = randomNumbers.match(/.{1,4}/g).join(' ');
    const iban = `${prefix} ${formattedNumbers}`;
    return iban;
 

}

export default IbanGenerator;
