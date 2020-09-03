export abstract class TelemetryService {
    public abstract initTelemetry(telemetryConfig:any);
    public abstract raiseInteractTelemetry(interactObject);
    public abstract raiseImpressionTelemetry(interactObject);
    public abstract raiseLogTelemetry(logObject);
    public abstract raiseErrorTelemetry(errorObject);
    public abstract raiseAuditTelemetry(auditObject);
    public abstract raiseStartTelemetry(startEventObject);
    public abstract raiseEndTelemetry(startEventObject);
    public abstract raiseShareTelemetry(shareEventObject);
    public abstract raiseFeedBackTelemetry(feedbackEventObject);
}