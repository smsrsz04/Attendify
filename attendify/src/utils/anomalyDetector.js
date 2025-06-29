// src/utils/anomalyDetector.js

export function detectAnomalies(dataArray) {
  const data = dataArray.map(Number);
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const std = Math.sqrt(data.reduce((sum, val) => sum + (val - mean) ** 2, 0) / data.length);

  return data.map((value, index) => ({
    index,
    value,
    isAnomaly: Math.abs(value - mean) > 2 * std,
  }));
}
