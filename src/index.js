'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import styles from './style.css';

export class DayCircle extends React.Component {
  makeClassNames(){
    if(this.props.unavailable){
      return this.props.renderClassNames('dayCircleUnavailable','rwdp-DayCircle rwdp-DayCircle-unavailable rwdp-flex-box rwdp-flex-column rwdp-justify-content-center rwdp-align-items-center')
    } else if(this.props.selected){
      return this.props.renderClassNames('dayCicleSelected','rwdp-DayCircle rwdp-DayCircle-selected rwdp-flex-box rwdp-flex-column rwdp-justify-content-center rwdp-align-items-center')
    }else{
      return this.props.renderClassNames('dayCicle','rwdp-DayCircle rwdp-flex-box rwdp-flex-column rwdp-justify-content-center rwdp-align-items-center')
    }
  }
  renderToday(){
    if(moment().isSame(this.props.day, 'day') ){
      return(
        <div className={this.props.renderClassNames('dayCircleTodayText','rwdp-DayCircle-today')}>
          {this.props.todayText || '- TODAY -'}
        </div>
      )
    }
  }
  renderUnavailable(){
    if(this.props.unavailable){
      return(
        <div className={this.props.renderClassNames('dayCircleUnavailableText','rwdp-DayCircle-unavailable-text')}>
          {this.props.unavailableText || 'unavailable'}
        </div>
      )
    }
  }
  render(){
    const { firstLineFormat, secondLineFormat, firstLineMobileFormat, secondLineMobileFormat } = this.props;
    const name = this.props.mobilView ? this.props.day.format(firstLineMobileFormat || 'dddd') : this.props.day.format(firstLineFormat || 'ddd')
    const date = this.props.mobilView ? this.props.day.format(secondLineMobileFormat || 'MMMM D, Y') : this.props.day.format(secondLineFormat || 'MMM D')
    return(
      <button
        disabled={this.props.unavailable}
        onClick={()=>this.props.click(this.props.day)}
        className={this.props.renderClassNames('dayCircleContainer',(this.props.mobilView ? "rwdp-DayCircle-container" : "rwdp-DayCircle-container rwdp-flex-box rwdp-flex-column rwdp-justify-content-center rwdp-align-items-center") )}
      >
        <div className={this.makeClassNames()}>
          <strong>{name}</strong>
          <div>{date}</div>
          {this.renderToday()}
          {this.renderUnavailable()}
        </div>
      </button>
    )
  }
}


class ReactWeeklyDayPicker extends React.Component {

	constructor(props) {
      super(props);
      const selectedDays = this.props.selectedDays || []
      let convertedSelectedDays = selectedDays.map((day)=>{
        if(moment.isMoment(day)){
          return day;
        }else{
          return moment(day);
        }
      });
      let convertedStartDay;
      if(this.props.startDay){
        if(moment.isMoment(this.props.startDay)){
          convertedStartDay = this.props.startDay;
        }else{
          convertedStartDay = moment(this.props.startDay);
        }
      }else{
        convertedStartDay = moment();
      }
      this.state = {
          daysCount: this.props.daysCount || 7,
          selectedDays: convertedSelectedDays,
          startDay: convertedStartDay,
          multipleDaySelect: this.props.multipleDaySelect!=undefined ? this.props.multipleDaySelect : true,
          format: this.props.format!=undefined ? this.props.format : null,
          unavailables: this.props.unavailables != undefined ? this.props.unavailables : false,
          mobilView: this.props.mobilView != undefined ? this.props.mobilView : false,
          hiddens: this.props.hiddens != undefined ? this.props.hiddens : false,
          beforeToday: this.props.beforeToday != undefined ? this.props.beforeToday : false,
      }
  }
  componentWillReceiveProps(nextProps){
    const selectedDays = nextProps.selectedDays || []
    let convertedSelectedDays = selectedDays.map((day)=>{
      if(moment.isMoment(day)){
        return day;
      }else{
        return moment(day);
      }
    });
    let convertedStartDay;
    if(nextProps.startDay){
      if(moment.isMoment(nextProps.startDay)){
        convertedStartDay = nextProps.startDay;
      }else{
        convertedStartDay = moment(nextProps.startDay);
      }
    }else{
      convertedStartDay = this.state.startDay;
    }
    this.setState({
      selectedDays: convertedSelectedDays,
      startDay: convertedStartDay,
      daysCount: nextProps.daysCount || 7,
      multipleDaySelect: nextProps!=undefined ? nextProps.multipleDaySelect : true,
      format: nextProps.format!=undefined ? nextProps.format : null,
      unavailables: nextProps.unavailables != undefined ? nextProps.unavailables : false,
      mobilView: nextProps.mobilView != undefined ? nextProps.mobilView : false,
      hiddens: nextProps.hiddens != undefined ? nextProps.hiddens : false,
      beforeToday: nextProps.beforeToday != undefined ? nextProps.beforeToday : false,
    })
  }
  convertOutput(dayArray){
    let output = dayArray.map(d=>d.clone().format(this.state.format))
    if(this.props.selectDay){
      this.props.selectDay(output);
    }
  }
  convertOutputUnselect(day){
    let output = day.clone().format(this.state.format);
    if(this.props.unselectDay){
      this.props.unselectDay(output);
    }
  }
  daySelect=(day)=>{
    if(this.state.multipleDaySelect){
      const newArray = this.state.selectedDays;
      let deleting = false;
      this.state.selectedDays.forEach((d,i)=>{
        if( day.isSame(d, 'day') ){
          newArray.splice(i, 1);
          deleting = true;
        }
      });
      if(!deleting){
        this.setState({
          selectedDays: [...this.state.selectedDays, day]
        });
        this.convertOutput([...this.state.selectedDays, day])
      }else{ //remove existed day
        this.convertOutputUnselect(day);
        this.setState({
          selectedDays: newArray,
        })
        this.convertOutput(newArray)
      }
    }else{
      if( day.isSame(this.state.selectedDays[0], 'day')){ //remove existed day
        this.convertOutputUnselect(day);
        this.setState({
          selectedDays: []
        })
        this.convertOutput([])
      }else{
        this.setState({
          selectedDays: [day]
        })
        this.convertOutput([day])
      }
    }

  }
  checkSelectedDay(day){
    let selected = false;
    if(this.state.selectedDays.length > 0){
      this.state.selectedDays.forEach((d,i)=>{
        if( day.isSame(d, 'day') ){
          selected = true;
        }
      })
    }
    return selected;
  }
  checkUnavailables(day){
    let unavailable = false;
    if(this.state.unavailables){
      if(this.state.unavailables.weekly){
        this.state.unavailables.weekly.forEach((d,i)=>{
          if( day.weekday() == d ){
            unavailable = true;
          }
        });
      }
      if(this.state.unavailables.dates){
        this.state.unavailables.dates.forEach((d,i)=>{
          if( day.isSame(moment(d), 'day') ){
            unavailable = true;
          }
        });
      }
      if(this.state.unavailables.relative){
        this.state.unavailables.relative.forEach((r,i)=>{
          if( day.isSame(moment().clone().add(r, 'days'), 'day') ){
            unavailable = true;
          }
        });
      }
    }

    if(!this.state.beforeToday){
      if(day.isBefore(moment(), 'day') ){
        unavailable = true;
      }
    }
    return unavailable;
  }
  checkHiddenDay(day){
    let hidden = false;
    if(this.state.hiddens){
      if(this.state.hiddens.weekly){
        this.state.hiddens.weekly.forEach((d,i)=>{
          if( day.weekday() == d ){
            hidden = true;
          }
        });
      }
      if(this.state.hiddens.dates){
        this.state.hiddens.dates.forEach((d,i)=>{
          if(day.isSame(moment(d), 'day')){
            hidden = true;
          }
        });
      }
      if(this.state.hiddens.relative){
        this.state.hiddens.relative.forEach((r,i)=>{
          if( day.isSame(moment().clone().add(r, 'days'), 'day') ){
            hidden = true;
          }
        });
      }
    }
    return hidden;
  }
  prevWeek=()=>{
    this.setState({
      startDay: this.state.startDay.clone().add(-this.state.daysCount, 'days')
    },()=>{
      if (this.props.onPrevClick) {
        this.props.onPrevClick(this.state.startDay, this.state.selectedDays);
      }
    })
  }
  nextWeek=()=>{
    this.setState({
      startDay: this.state.startDay.clone().add(this.state.daysCount, 'days')
    },()=>{
      if (this.props.onNextClick) {
        this.props.onNextClick(this.state.startDay, this.state.selectedDays);
      }
    })
  }
  renderDesktopView(weekdays){
    const dayComps = weekdays.map((day,i)=> <DayCircle {...this.props} renderClassNames={this.renderClassNames} todayText={this.props.todayText} unavailableText={this.props.unavailableText} day={day} key={i} click={this.daySelect} selected={this.checkSelectedDay(day)} unavailable={this.checkUnavailables(day)}/>)
    return(
      <div className={this.renderClassNames('dayBox','rwdpDayBoxDesktop rwdp-flex-box rwdp-flex-row rwdp-justify-content-space-between')}>
        {dayComps}
      </div>
    )
  }
  renderMobilView(weekdays){
    const dayComps = weekdays.map((day,i)=> <DayCircle {...this.props} renderClassNames={this.renderClassNames} todayText={this.props.todayText} unavailableText={this.props.unavailableText} day={day} key={i} click={this.daySelect} selected={this.checkSelectedDay(day)} unavailable={this.checkUnavailables(day)} mobilView={true}/>)
    return(
      <div className={this.renderClassNames('dayBox','rwdpDayBoxMobil rwdp-flex-box rwdp-flex-column rwdp-justify-content-space-between')}>
        {dayComps}
      </div>
    )
  }
  renderClassNames=(type,name)=>{
    if(this.props.classNames){
      if(this.props.classNames[type]){
        return this.props.classNames[type]
      }
    }
    return name;
  }
  render(){
    const startDay = this.state.startDay;
    const weekdays = [];
    for (var index = 0; weekdays.length < this.state.daysCount; index++) {
      let day = startDay.clone().add(index, 'days');
      if(!this.checkHiddenDay(day)){
        weekdays.push(day);
      }
    }

    let days = null;
    if(this.state.mobilView){
      days = this.renderMobilView(weekdays)
    }else{
      days = this.renderDesktopView(weekdays)
    }
    return(
      <div className={this.renderClassNames('container','rwdpDayPickerContainer')}>
        <div onClick={this.prevWeek} className={this.renderClassNames('prevWeekArrow','rwdpPrevWeekArrow')}></div>
        <div onClick={this.nextWeek} className={this.renderClassNames('nextWeekArrow','rwdpNextWeekArrow')}></div>
        {days}
      </div>
    )
  }
}

ReactWeeklyDayPicker.propTypes = {
};

export default ReactWeeklyDayPicker;
