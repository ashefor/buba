import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  allLotteryNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
  showBetSlip = false;
  selectedNumbersContainer: any[] = [];
  miniBar = false;
  stake_amount: any[] = [];
  selectedNumbers: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  addToSlip(number) {
    const foundIndex = this.selectedNumbers.findIndex(num => num === number);
    console.log(foundIndex);
    if (foundIndex === -1) {
      if (this.selectedNumbers.length === 6) {
        return;
      } else {
        this.selectedNumbers.push(number);
      }
    } else {
      this.selectedNumbers.splice(foundIndex, 1);
      console.log(this.selectedNumbers);
    }
  }

  showSideBar() {
    const newSelectedNumbers = [...this.selectedNumbers]
    this.selectedNumbersContainer.push(newSelectedNumbers);
    console.log(this.selectedNumbersContainer)
    this.showBetSlip = true;
    setTimeout(() => {
      this.miniBar = true;
    }, 100);
  }

  getBackgroundColor(number) {
    const foundIndex = this.selectedNumbers.findIndex(num => num === number);
    if (foundIndex === -1) {
      if (this.selectedNumbers.length === 6) {
        return false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  removeFromSlip(index) {
    this.selectedNumbersContainer.splice(index, 1);
    if(this.selectedNumbersContainer.length === 0) {
      this.miniBar = false;
    setTimeout(() => {
      this.showBetSlip = false;
    }, 100);
    }
  }

  changeAmt(index, event) {
    console.log(index, event)
  }
  
  playGames() {
    console.log(this.stake_amount)
  }

  get totalStakeAmount() {
    return this.stake_amount.reduce((acc, item) => acc + item, 0)
  }
}
