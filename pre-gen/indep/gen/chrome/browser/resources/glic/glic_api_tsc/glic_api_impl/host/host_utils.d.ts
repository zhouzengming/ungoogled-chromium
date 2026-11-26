import type { //
InterfaceDef, //
PendingRemote, //
PostMessageRemote, //
PostMessageRouter } from '../transport/post_message_transport.js';
export interface HasMojoConnection {
    onConnectionError: {
        addListener: (l: Function) => number;
    };
    $: {
        close(): void;
        bindNewPipeAndPassRemote(): unknown;
    };
}
export interface HasPostMessagePipe {
    addCloseHandler(f: Function): void;
    close(): void;
}
export declare function linkPipeClosure(...entries: Array<HasPostMessagePipe | HasMojoConnection>): void;
export declare function createForwardingMojoRemote<MojoInterface, PostMessageInterface extends InterfaceDef, MojoReceiverType extends HasMojoConnection>(router: PostMessageRouter, postMessagePipe: PendingRemote<PostMessageInterface>, receiverConstructor: new (impl: MojoInterface) => MojoReceiverType, implConstructor: new (remote: PostMessageRemote<PostMessageInterface>) => MojoInterface): {
    receiver: MojoReceiverType;
    remote: ReturnType<MojoReceiverType['$']['bindNewPipeAndPassRemote']>;
};
