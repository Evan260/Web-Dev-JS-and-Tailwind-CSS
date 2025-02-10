import { useState } from 'react';

// Higher-order function for unit conversion
const createConverter = (forwardFn, backwardFn) => (direction) => {
  return (value) => {
    const fn = direction === 'forward' ? forwardFn : backwardFn;
    return fn(value);
  };
};

// Conversion functions
const weightConverter = createConverter(
  (kg) => kg * 2.20462, // kg to lb
  (lb) => lb / 2.20462  // lb to kg
);

const distanceConverter = createConverter(
  (km) => km * 0.621371, // km to miles
  (miles) => miles / 0.621371 // miles to km
);

const temperatureConverter = createConverter(
  (celsius) => (celsius * 9/5) + 32, // °C to °F
  (fahrenheit) => (fahrenheit - 32) * 5/9 // °F to °C
);

import PropTypes from 'prop-types';

const ConversionForm = ({ 
  forwardLabel, 
  backwardLabel, 
  converter,
  precision = 2 
}) => {
  const [singleValue, setSingleValue] = useState('');
  const [arrayValues, setArrayValues] = useState('');
  const [direction, setDirection] = useState('forward');
  const [results, setResults] = useState({ single: '', array: '' });

  const handleConvert = () => {
    const convert = converter(direction);
    
    const singleResult = singleValue ? convert(parseFloat(singleValue)) : '';
    const arrayResult = arrayValues ? 
      arrayValues.split(',').map(v => convert(parseFloat(v.trim()))) : '';

    setResults({
      single: singleResult ? singleResult.toFixed(precision) : '',
      array: Array.isArray(arrayResult) ? 
        arrayResult.map(v => v.toFixed(precision)).join(', ') : ''
    });
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setDirection('forward')}
          className={`px-4 py-2 rounded border ${
            direction === 'forward' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          {forwardLabel}
        </button>
        <button
          onClick={() => setDirection('backward')}
          className={`px-4 py-2 rounded border ${
            direction === 'backward' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          {backwardLabel}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-2">
            Single Value ({direction === 'forward' ? forwardLabel.split('→')[0].trim() : backwardLabel.split('→')[0].trim()})
          </label>
          <input
            type="number"
            value={singleValue}
            onChange={(e) => setSingleValue(e.target.value)}
            placeholder="Enter a value"
            className="w-full p-2 border rounded"
          />
          {results.single && (
            <div className="mt-2 text-sm">
              Result: {results.single} {direction === 'forward' ? forwardLabel.split('→')[1].trim() : backwardLabel.split('→')[1].trim()}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2">
            Array Values (comma-separated)
          </label>
          <input
            value={arrayValues}
            onChange={(e) => setArrayValues(e.target.value)}
            placeholder="e.g., 1, 2, 3, 4"
            className="w-full p-2 border rounded"
          />
          {results.array && (
            <div className="mt-2 text-sm">
              Results: {results.array}
            </div>
          )}
        </div>

        <button
          onClick={handleConvert}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Convert
        </button>
      </div>
    </div>
  );
};

const WeightConverter = () => (
  <ConversionForm
    forwardLabel="Kilograms → Pounds"
    backwardLabel="Pounds → Kilograms"
    converter={weightConverter}
  />
);

const DistanceConverter = () => (
  <ConversionForm
    forwardLabel="Kilometers → Miles"
    backwardLabel="Miles → Kilometers"
    converter={distanceConverter}
  />
);

const TemperatureConverter = () => (
  <ConversionForm
    forwardLabel="Celsius → Fahrenheit"
    backwardLabel="Fahrenheit → Celsius"
    converter={temperatureConverter}
    precision={1}
  />
);

const UnitConverter = () => {
  const [activeTab, setActiveTab] = useState('weight');

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Unit Converter</h1>
      
      <div className="border rounded-t">
        <div className="flex border-b">
          {['weight', 'distance', 'temperature'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 p-2 text-center capitalize ${
                activeTab === tab 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'weight' && <WeightConverter />}
        {activeTab === 'distance' && <DistanceConverter />}
        {activeTab === 'temperature' && <TemperatureConverter />}
      </div>
    </div>
  );
};

// PropTypes validation
ConversionForm.propTypes = {
  forwardLabel: PropTypes.string.isRequired,
  backwardLabel: PropTypes.string.isRequired,
  converter: PropTypes.func.isRequired,
  precision: PropTypes.number
};

export default UnitConverter;