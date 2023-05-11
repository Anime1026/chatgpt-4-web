function range(start, end, increment = 1) {
  const count = Math.floor((end - start + increment) / increment);
  return Array(count)
    .fill(0)
    .map((_, idx) => start + idx * increment);
}

const minFontSize = 5;
const maxFontSize = 80;

const minFontWeight = 100;
const maxFontWeight = 1000;

const minSpacingPixel = 0;
const maxSpacingPixel = 800;
const spacingPixelIncrement = 5;

const vhs = ['10vh', '20vh', '30vh', '40vh', '50vh', '60vh', '70vh', '80vh', '90vh', '100vh'];

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      '4xs': '280px',
      '3xs': '320px',
      '2xs': '380px',
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1780px'
    },
    // Extend default configurations
    extend: {
      colors: {
        primary: '#0e1621',
        second: '#17212b',
        third: '#242f3d',
        forth: '#2b5278',
        fifth: '#607483',
        blue: '#2AB9F6',
        purple: '#7B4DD9',
        red: '#EE3254',
        yellow: '#F9B020',
        green: '#06B26E',
        'thin-blue': '#66EEF7',
        'thin-purple': '#F1F1FE',
        'think-blue': '#02509B',
        'thick-purple': '#7C4DD9',
        'thin-gray': '#EBF5FF',
        'thick-gray': '#434343'
      },
      container: {
        center: true
      }
    },
    // Override default configurations
    fontWeight: {
      ...range(minFontWeight, maxFontWeight).reduce((merged, f) => ({ ...merged, [f]: `${f}px` }), {})
    },
    fontSize: {
      ...range(minFontSize, maxFontSize).reduce((merged, f) => ({ ...merged, [f]: `${f}px` }), {})
    },
    spacing: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      )
    },
    maxWidth: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      )
    },
    minWidth: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      )
    },
    maxHeight: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      ),
      ...vhs.reduce((merged, vh) => ({ ...merged, [vh]: vh }), {})
    },
    minHeight: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      ),
      ...vhs.reduce((merged, vh) => ({ ...merged, [vh]: vh }), {})
    }
  },
  plugins: []
};
