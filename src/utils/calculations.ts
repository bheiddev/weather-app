export const calculateDailySnowfall = (hourlyData: Array<{ values: { snowAccumulation: number } }>) => {
    const dailyTotals: number[] = [];
    
    console.log('Calculating daily snowfall from hourly data:', hourlyData);
  
    for (let day = 0; day < 6; day++) {
      const startIndex = day * 24;
      const endIndex = startIndex + 24;
      const dailyHours = hourlyData.slice(startIndex, endIndex);
      
      const dailyTotal = dailyHours.reduce((total, hour) => {
        return total + (hour.values.snowAccumulation || 0);
      }, 0);
  
      console.log(`Day ${day + 1} snow total:`, {
        hours: dailyHours.length,
        total: dailyTotal * 0.393701,
        rawData: dailyHours
      });
  
      dailyTotals.push(dailyTotal * 0.393701);
    }
  
    console.log('Final daily totals (inches):', dailyTotals);
    return dailyTotals;
  };