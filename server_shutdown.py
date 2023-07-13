import boto3
import datetime

REGION = 'us-east-2'
CLUSTER = 'minecraft'
SERVICE = 'minecraft-server'


def lambda_handler(event, context):
    #shutting down the server when it detects no CPU usage from the fargate instances, currently quiet inefficient due to the 
    #function being called by cloudwatch every time a player leaves the server
    #https://alexwlchan.net/2020/finding-the-bottlenecks-in-an-ecs-cluster/
    #https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cloudwatch/client/get_metric_statistics.html#

    ecs = boto3.client('ecs', region_name=REGION)
    response = ecs.describe_services(
        cluster=CLUSTER,
        services=[SERVICE],
    )

    cloudwatch = boto3.client("cloudwatch")

    data = cloudwatch.get_metric_statistics(
        Namespace="AWS/ECS",
        MetricName="CPUUtilization",
        Dimensions=[
            {"Name": CLUSTER, "Value": "curr_use"},
        ],
        StartTime=datetime.datetime.now(),
        EndTime=datetime.datetime.now(),
        Period=60,
        Statistics=["curr_use_val"]
    )

    if data['Datapoints']["curr_use_val"] == 0:
        ecs.update_service(
            cluster=CLUSTER,
            service=SERVICE,
            desiredCount=0,
        )
