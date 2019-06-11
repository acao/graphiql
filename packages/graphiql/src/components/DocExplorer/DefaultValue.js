import React from 'react';
import PropTypes from 'prop-types';
import { astFromValue, print } from 'graphql';

export default function DefaultValue({ field }) {
  const { type, defaultValue } = field;
  if (defaultValue !== undefined) {
    return (
      <span>
        {' = '}
        <span className="arg-default-value">
          {print(astFromValue(defaultValue, type))}
        </span>
      </span>
    );
  }

  return null;
}

DefaultValue.propTypes = {
  field: PropTypes.object.isRequired,
};
