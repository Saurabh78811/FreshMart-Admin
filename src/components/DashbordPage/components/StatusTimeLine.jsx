import { XCircle } from "lucide-react";
import { statusTimelineStyles as s } from "../../../assets/dummyStyles";

const StatusTimeline = ({ status }) => {
    if(status === "cancelled"){
        return (
            <div className={s.cancelledContainer}>
                <XCircle className={s.cancelledIcon} />
                <span className={s.cancelledText}>Order Cancelled</span>
            </div>
        )
    }
    const steps = ["Processing","On the way", "Delivered"];
    const currentIndex = steps.indexOf(status);

    return(
        <div className={s.timeline}>
            {steps.map((step, index) => {
                const active = currentIndex >= index;
                const last = index === steps.length - 1 ;
                return (
                    <div className={s.stepWrapper} key = {step}>
                        <div className={s.stepInner}>
                            <span className={`${s.stepDot} ${
                                active ? s.stepDotActive : s.stepDotInactive
                            }`}/>
                            <span className={`${s.stepLabel} ${
                                active ? s.stepLabelActive : s.stepLabelInactive
                            }`}>
                                {
                                    step
                                }

                            </span>
                        </div>
                        {!last && (
                            <span className={`${s.stepLine} ${
                                active ? s.stepLineActive : s.stepLineInactive
                            }`} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default StatusTimeline;