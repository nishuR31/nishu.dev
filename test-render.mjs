import React from 'react';
import { renderToString } from 'react-dom/server';

// Mocking minimal Button
const Slot = ({ children }) => {
  let slottableChild;
  let otherChildren = [];
  React.Children.forEach(children, child => {
    if (child && child.type === 'Slottable') {
      slottableChild = child.props.children;
    } else {
      otherChildren.push(child);
    }
  });
  if (!slottableChild) return null;
  return React.cloneElement(slottableChild, {}, ...otherChildren, slottableChild.props.children);
};

const Button = ({ asChild, Icon, children }) => {
  const Comp = asChild ? Slot : 'button';
  return React.createElement(Comp, null, 
    Icon ? React.createElement('div', null, 'Icon') : null,
    React.createElement('Slottable', null, children)
  );
};

try {
  const html = renderToString(
    React.createElement(Button, { asChild: true, Icon: 'icon' }, 
      React.createElement('a', { href: '/test' }, 'Link Text')
    )
  );
  console.log("Rendered:", html);
} catch (e) {
  console.error("Error:", e);
}
