export const colors = {
    lightPurple: 'rgb(169, 181, 223)',
    Purple: 'rgb(120, 134, 199)'
  };
  
  export const getContrastColor = (baseColor: string) => {
    return baseColor === colors.lightPurple ? colors.Purple : colors.lightPurple;
  };