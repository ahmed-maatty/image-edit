import PropTypes from 'prop-types';

const validPositions = [
  'top-right rotate-180',
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
  'left',
  'right'
];

function Bubble({ position }) {
  if (!validPositions.includes(position)) {
    throw new Error(
      `Invalid position "${position}" provided to Bubble component. ` +
      `Valid positions are: ${validPositions.join(', ')}`
    );
  }

  return <span className={`bubble ${position}`}></span>;
}

Bubble.propTypes = {
  position: PropTypes.oneOf(validPositions).isRequired,
};

export default Bubble;