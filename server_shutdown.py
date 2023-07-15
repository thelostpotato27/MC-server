import boto3
import datetime

REGION = 'us-east-2'
CLUSTER = 'minecraft'
SERVICE = 'minecraft-server'


def lambda_handler(event, context):
    #changed the server to auto update whenever a player joins/leaves. The function sums all connections to the service
    #and then adjusts the amount of servers to be 1/2 of the player num.

    ecs = boto3.client('ecs', region_name=REGION)
    response = ecs.describe_services(
        cluster=CLUSTER,
        services=[SERVICE],
    )

    running_tasks = ecs['clusters'][0]['running_tasks']

    # Get the number of connections for each task.
    connections = []
    for task in running_tasks:
        connections.append(task['connections'])

    num_connections = sum(connections)


    ecs.update_service(
        cluster=CLUSTER,
        service=SERVICE,
        desiredCount=int(num_connections/2))
