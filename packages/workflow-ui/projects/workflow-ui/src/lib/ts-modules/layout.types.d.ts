declare module 'bpmn-moddle-auto-layout' {
    class AutoLayout {
        layoutProcess(xml: string, cb: (err: Error, xml: string) => void): void;
    }
    export = AutoLayout;
}