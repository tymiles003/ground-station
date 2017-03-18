import { Component } from "@angular/core";
import { SocketService } from "app/socket/socket.service";
import { AxesChart } from "app/shared/axes-chart/axes-chart";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector:    "pids-chart",
  templateUrl: "pids-chart.component.html"
})

export class PIDsChartComponent {
  private channelSubscriptions: Array<Subscription> = [];
  private channelName:string = "black_box:pids";

  public chartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    tooltips: {
      enabled: false
    },
    scales: {
      yAxes: [{
        ticks: {
          min: -500,
          max: 500
        }
      }]
    },
    animation:{
      duration: 0,
      easing: "linear",
      animateScale: false
    }
  };
  public chartPIDs:string[] = ["pitch_rate_pid_controller", "roll_rate_pid_controller", "yaw_rate_pid_controller", "pitch_angle_pid_controller", "roll_angle_pid_controller"];
  public chartLabels:string[] = ["Pitch Rate", "Roll Rate", "Yaw Rate", "Pitch Angle", "Roll Angle"];
  public chartLegend:boolean = true;

  public chartData:any[] = [
    {data: [], label: "Propotional"},
    {data: [], label: "Integrative"},
    {data: [], label: "Derivative"},
    {data: [], label: "Error"},
    {data: [], label: "Output"}
  ];

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.chartPIDs.forEach(chartPid => {
      let index = this.chartPIDs.indexOf(chartPid);
      this.channelSubscriptions.push(this.socketService.on("black_box:" + chartPid, "data").subscribe(data => {
        this.chartData[0].data[index] = data["proportional_term"]
        this.chartData[1].data[index] = data["integrative_term"]
        this.chartData[2].data[index] = data["derivative_term"]
        this.chartData[3].data[index] = data["error"]
        this.chartData[4].data[index] = data["output"]

        this.chartData = this.chartData.slice();
      }))
    });

  }

  ngOnDestroy(): void {
    this.channelSubscriptions.forEach(function(channelSubscription) {
      channelSubscription.unsubscribe();
    });
  }
}
