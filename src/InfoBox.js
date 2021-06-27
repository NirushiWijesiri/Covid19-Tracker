import React from 'react'
import {Card, CardContent, Typography} from "@material-ui/core"


function InfoBox({title, cases, total}) {
    return (
        <Card className="infoBox">
            <CardContent>
                {/*Title*/}
                <Typography className="infoBox_title" color="textSecondory" >
                    {title}
                </Typography>
                {/*+120k Number of cases*/}
                <h2 className="infoBox_cases">{cases}</h2>
                {/*1.2M Total cases*/}
                <Typography className="infoBox_total" color="textSecondory" >
                    {total}
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox
