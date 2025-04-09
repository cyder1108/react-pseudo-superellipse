import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { SuperEllipse } from './super-ellipse';

export default {
  title: 'SuperEllipse',
  component: SuperEllipse,
} as Meta<typeof SuperEllipse>;

const Template: StoryFn<typeof SuperEllipse> = (args) => <SuperEllipse {...args} style={{ width: '200px', height: '200px', backgroundColor: 'lightblue' }} />;

export const Default = Template.bind({});

Default.args = {
  tag: 'div',
  exponent: 4,
  round: 30,
  quality: 1,
};
