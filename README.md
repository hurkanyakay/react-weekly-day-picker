# React Weekly Day Picker

This react component provides weekly view and day picker option like calendly.

This component makes use of moment.js.


## Installation

To install this Component, run `yarn add react-weekly-day-picker` or `npm install react-weekly-day-picker`.


## Usage

To use the component, In your react Application just do

```javascript
import React from 'react';
import CodeHighlight from 'react-weekly-day-picker';

const MyComponent = (props) => {

	return (
		<ReactWeeklyDayPicker />
	)

}

export default MyComponent;

```
## Props

You can also provide additional configuration like

```javascript
<ReactWeeklyDayPicker
	daysCount={7}  //How many days will be shown
	classNames={}  //Overrides classnames for custom classes (below example)
	startDay={new Date()} // First day as Date Object or 22 June 2016
	selectedDays={['22 June 2017', new Date()]} // Selected days (below example)
	multipleDaySelect={true} //enables multiple day selection
	selectDay={function(day){}}
	unselectDay={function(day){}}
	format={'YYYY-MM-DD'} //format of dates that handled in selectDay and unselectDay functions
	unavailables={{
		dates:['22 July 2017'],  //unavailable dates list
		relative:[0,1],  //unavailable dates list relative to today (0:today, 1:tomorrow, -1:yesterday)
		weekly: [0] //unavailable dates list for each week (0:Sunday, 1:Monday ...)
	}}
	mobilView={window.innerWidth < 1024}  // enables mobil view
	beforeToday={false}   // all dates before today set as unavailable (default:true)
	hiddens={{  // makes dates invisible
		dates: ['22 July 2017'], //absolute dates list
		relative: [2], // relative to today (0:today, 1:tomorrow, -1:yesterday)
		weekly: [1]  //each week (0:Sunday, 1:Monday ...)
	}}
	todayText={"today"}  // replacing today text (default : - TODAY -)
	unavailableText={"Unavailable"}  // replacing unavailable text (default: unavailable )
/>
```
