'use strict';
import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment';
import styles from './style.css';
import DayCircle from './DayCircle';
import momentPropTypes from 'react-moment-proptypes'
import { Wrapper, PrevArrow, NextArrow, Container } from './styles';
/**
 *  React Weekly Day Picker
 */
export default class ReactWeeklyDayPicker extends React.Component {
  static propTypes = {
    selectedDays: PropTypes.arrayOf(momentPropTypes.momentObj),
    startDay: momentPropTypes.momentObj,
    daysCount: PropTypes.number,
    multipleDaySelect: PropTypes.bool,
    unavailables: PropTypes.objectOf(
      PropTypes.shape({
        dates:PropTypes.arrayOf(momentPropTypes.momentObj),
        relative:PropTypes.arrayOf(PropTypes.number),
        weekly:PropTypes.arrayOf(PropTypes.number)
      })
    ),
    hiddens: PropTypes.objectOf(
      PropTypes.shape({
        dates:PropTypes.arrayOf(momentPropTypes.momentObj),
        relative:PropTypes.arrayOf(PropTypes.number),
        weekly:PropTypes.arrayOf(PropTypes.number)
      })
    ),
    mobilView: PropTypes.bool,
    beforeToday: PropTypes.bool,
    todayText: PropTypes.string,
    unavailableText: PropTypes.string,
    selectDay: PropTypes.func,
    unselectDay: PropTypes.func,
    onPrevClick: PropTypes.func,
    onNextClick: PropTypes.func,
  }
  static defaultProps = {
    selectedDays: [],
    startDay: moment(),
    daysCount: 7,
    multipleDaySelect: false,
    unavailables:false,
    hiddens:false,
    mobilView:false,
    beforeToday:true,
    todayText:'-TODAY-',
    unavailableText:'unavailable',
    selectDay: ()=>{},
    unselectDay: ()=>{},
    onPrevClick:()=>{},
    onNextClick:()=>{}
  }
	constructor(props) {
      super(props);
      /**
       * v1.0.3 -> v1.0.4
       * Changing date type to moment only. Input moment -> output moment object
       */
      this.state = {
          selectedDays: this.props.selectedDays,
          startDay: this.props.startDay,
      }
  }
  // componentWillReceiveProps(nextProps){
  //   const selectedDays = nextProps.selectedDays || []
  //   let convertedSelectedDays = selectedDays.map((day)=>{
  //     if(moment.isMoment(day)){
  //       return day;
  //     }else{
  //       return moment(day);
  //     }
  //   });
  //   let convertedStartDay;
  //   if(nextProps.startDay){
  //     if(moment.isMoment(nextProps.startDay)){
  //       convertedStartDay = nextProps.startDay;
  //     }else{
  //       convertedStartDay = moment(nextProps.startDay);
  //     }
  //   }else{
  //     convertedStartDay = this.state.startDay;
  //   }
  //   this.setState({
  //     selectedDays: convertedSelectedDays,
  //     startDay: convertedStartDay,
  //     daysCount: nextProps.daysCount || 7,
  //     multipleDaySelect: nextProps!=undefined ? nextProps.multipleDaySelect : true,
  //     format: nextProps.format!=undefined ? nextProps.format : null,
  //     unavailables: nextProps.unavailables != undefined ? nextProps.unavailables : false,
  //     mobilView: nextProps.mobilView != undefined ? nextProps.mobilView : false,
  //     hiddens: nextProps.hiddens != undefined ? nextProps.hiddens : false,
  //     beforeToday: nextProps.beforeToday != undefined ? nextProps.beforeToday : false,
  //   })
  // }
  daySelect=(day)=>{
    if(this.props.multipleDaySelect){
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
        this.props.selectDay([...this.state.selectedDays, day]);
      }else{ //remove existed day
        this.props.unselectDay(day)
        this.setState({
          selectedDays: newArray,
        })
        this.props.selectDay(newArray);
      }
    }else{
      if( day.isSame(this.state.selectedDays[0], 'day')){ //remove existed day
        this.props.unselectDay(day)
        if(this.props.unselectable) {
          this.setState({
            selectedDays: []
          })
          this.props.selectDay([])
        }
      }else{
        this.setState({
          selectedDays: [day]
        })
        this.props.selectDay([day])
      }
    }

  }
  checkSelectedDay(day){
    let selected = false;
    if(this.state.selectedDays.length > 0){
      this.state.selectedDays.forEach((d)=>{
        if( day.isSame(d, 'day') ){
          selected = true;
        }
      })
    }
    return selected;
  }
  checkUnavailables(day){
    let unavailable = false;
    if(this.props.unavailables){
      if(this.props.unavailables.weekly){
        this.props.unavailables.weekly.forEach((d)=>{
          if( day.weekday() == d ){
            unavailable = true;
          }
        });
      }
      if(this.props.unavailables.dates){
        this.props.unavailables.dates.forEach((d)=>{
          if( day.isSame(moment(d), 'day') ){
            unavailable = true;
          }
        });
      }
      if(this.props.unavailables.relative){
        this.props.unavailables.relative.forEach((r)=>{
          if( day.isSame(moment().clone().add(r, 'days'), 'day') ){
            unavailable = true;
          }
        });
      }
    }

    if(!this.props.beforeToday){
      if(day.isBefore(moment(), 'day') ){
        unavailable = true;
      }
    }
    return unavailable;
  }
  checkHiddenDay(day){
    let hidden = false;
    if(this.props.hiddens){
      if(this.props.hiddens.weekly){
        this.props.hiddens.weekly.forEach((d)=>{
          if( day.weekday() == d ){
            hidden = true;
          }
        });
      }
      if(this.props.hiddens.dates){
        this.props.hiddens.dates.forEach((d)=>{
          if(day.isSame(moment(d), 'day')){
            hidden = true;
          }
        });
      }
      if(this.props.hiddens.relative){
        this.props.hiddens.relative.forEach((r)=>{
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
      startDay: this.state.startDay.clone().add(-this.props.daysCount, 'days')
    },()=>{
      if (this.props.onPrevClick) {
        this.props.onPrevClick(this.state.startDay);
      }
    })
  }
  nextWeek=()=>{
    this.setState({
      startDay: this.state.startDay.clone().add(this.props.daysCount, 'days')
    },()=>{
      if (this.props.onNextClick) {
        this.props.onNextClick(this.state.startDay);
      }
    })
  }
  renderDesktopView(weekdays){
    const dayComps = weekdays.map((day,i)=> 
      <DayCircle {...this.props} renderClassNames={this.renderClassNames} todayText={this.props.todayText} unavailableText={this.props.unavailableText} day={day} key={i} click={this.daySelect} selected={this.checkSelectedDay(day)} unavailable={this.checkUnavailables(day)}/>)
    return(
      <div className={this.renderClassNames('dayBox','rwdpDayBoxDesktop rwdp-flex-box rwdp-flex-row rwdp-justify-content-space-between')}>
        {dayComps}
      </div>
    )
  }
  renderMobilView(weekdays){
    const dayComps = weekdays.map((day,i)=> 
      <DayCircle 
        {...this.props} 
        key={i}
        renderClassNames={this.renderClassNames} 
        todayText={this.props.todayText} 
        unavailableText={this.props.unavailableText} 
        day={day}  
        click={this.daySelect} 
        selected={this.checkSelectedDay(day)} 
        unavailable={this.checkUnavailables(day)} 
        mobilView={true}/>
    )
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
    for (var index = 0; index < this.props.daysCount; index++) {
      let day = startDay.clone().add(index, 'days');
      if(!this.checkHiddenDay(day)){
        weekdays.push(
          <DayCircle 
            key={index}
            {...this.props} 
            renderClassNames={this.renderClassNames} 
            day={day} 
            click={this.daySelect} 
            todayText={this.props.todayText} 
            isToday={moment().isSame(day, 'day')}
            selected={this.checkSelectedDay(day)} 
            unavailable={this.checkUnavailables(day)}
            unavailableText={this.props.unavailableText} 
          />
        );
      }
    }

    // let days = null;
    // if(this.props.mobilView){
    //   days = this.renderMobilView(weekdays)
    // }else{
    //   days = this.renderDesktopView(weekdays)
    // }
    // const days = weekdays.map((day,i)=> 
      
    // )
    // return(
    //   <div className={this.renderClassNames('dayBox','rwdpDayBoxDesktop rwdp-flex-box rwdp-flex-row rwdp-justify-content-space-between')}>
    //     {dayComps}
    //   </div>
    // )
    return(
      <Wrapper>
        <PrevArrow 
          onClick={this.prevWeek}
        />
        <NextArrow 
          onClick={this.nextWeek}
        />
        <Container mobil={this.props.mobilView}>
          {weekdays}
        </Container>
      </Wrapper>
    )
  }
}


