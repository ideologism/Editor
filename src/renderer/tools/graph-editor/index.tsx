import { IStringDictionary } from "../../../shared/types";

import * as React from "react";
import { Layout, Model, TabNode } from "flexlayout-react";
import {
    ButtonGroup, Menu, MenuDivider, MenuItem, Popover, Button, Position, Divider,
    ContextMenu, Classes,
} from "@blueprintjs/core";

import { Icon } from "../../editor/gui/icon";

import { Tools } from "../../editor/tools/tools";
import { undoRedo } from "../../editor/tools/undo-redo";

import { AbstractEditorPlugin, IEditorPluginProps } from "../../editor/tools/plugin";

import { GraphComponent } from "./graph";
import { GraphInspector } from "./inspector";

import layoutConfiguration from "./layout.json";

export const title = "Graph Editor";

export interface IGraphEditorPluginState {
    /**
     * Defines wether or not the graph is playing.
     */
    playing: boolean;
    /**
     * Defines wether or not the graph is played in standalone mode.
     */
    standalone: boolean;
}

export default class GraphEditorPlugin extends AbstractEditorPlugin<IGraphEditorPluginState> {
    /**
     * Defines the reference to the graph component.
     */
    public graphComponent: GraphComponent;

    private _components: IStringDictionary<React.ReactNode> = {};

    /**
     * Constructor.
     * @param props defines the component's props.
     */
    public constructor(props: IEditorPluginProps) {
        super(props);

        this.state = {
            playing: false,
            standalone: false,
        };

        // Register components
        this._components["graph"] = (<GraphComponent editor={this.editor} ref={(r) => this.graphComponent = r!} graphPath={props.openParameters.graphPath} />);
        this._components["inspector"] = (<GraphInspector editor={this.editor} toolId={Tools.RandomId()} _objectRef={null} />);
    }

    /**
     * Renders the component.
     */
    public render(): React.ReactNode {
        const layoutModel = Model.fromJson(layoutConfiguration);

        const file = (
            <Menu>
                <MenuItem text="Load From..." icon={<Icon src="folder-open.svg" />} onClick={() => this._handleLoadFrom()} />
                <MenuDivider />
                <MenuItem text="Save (CTRL + S)" icon={<Icon src="copy.svg" />} onClick={() => this._handleSave()} />
                <MenuItem text="Save As... (CTRL + SHIFT + S)" icon={<Icon src="copy.svg" />} onClick={() => this._handleSaveAs()} />
            </Menu>
        );

        const edit = (
            <Menu>
                <MenuItem text="Undo (CTRL + Z)" icon={<Icon src="undo.svg" />} onClick={() => undoRedo.undo()} />
                <MenuItem text="Redo (CTRL + Y)" icon={<Icon src="redo.svg" />} onClick={() => undoRedo.redo()} />
                <MenuDivider />
                <MenuItem text="Clear..." icon={<Icon src="recycle.svg" />} onClick={() => this._handleClearGraph()} />
            </Menu>
        );

        return (
            <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                <div className="bp3-dark" style={{ width: "100%", height: "80px", backgroundColor: "#444444" }}>
                    <ButtonGroup style={{ paddingTop: "4px" }}>
                        <Popover content={file} position={Position.BOTTOM_LEFT}>
                            <Button icon={<Icon src="folder-open.svg" />} rightIcon="caret-down" text="File" />
                        </Popover>
                        <Popover content={edit} position={Position.BOTTOM_LEFT}>
                            <Button icon={<Icon src="edit.svg" />} rightIcon="caret-down" text="Edit" />
                        </Popover>
                    </ButtonGroup>
                    <Divider />
                    <ButtonGroup style={{ position: "relative", left: "50%", transform: "translate(-50%)" }}>
                        <Button disabled={this.state.playing} icon={<Icon src="play.svg" />} rightIcon="caret-down" text="Play" onContextMenu={(e) => this._handlePlayContextMenu(e)} onClick={() => this._handleStart(false)} />
                        <Button disabled={!this.state.playing} icon={<Icon src="square-full.svg" />} text="Stop" onClick={() => this._handleStop()} />
                        <Button disabled={!this.state.playing} icon="reset" text="Restart" onClick={() => {
                            this._handleStop();
                            this._handleStart(this.state.standalone);
                        }} />
                    </ButtonGroup>
                    <Divider />
                </div>
                <Layout model={layoutModel} factory={(n) => this._rootLayoutFactory(n)}} />
            </div>
        );
    }

    /**
     * Called on the plugin is ready.
     */
    public onReady(): void {
        // Empty for now...
    }

    /**
     * Called on the plugin is closed.
     */
    public onClose(): void {
        // Empty for now...
    }

    /**
     * Called on the plugin was previously hidden and is now shown.
     */
    public onShow(): void {
        debugger;
    }

    /**
     * Called on the plugin was previously visible and is now hidden.
     */
    public onHide(): void {
        debugger;
    }

    /**
     * Called each time a FlexLayout.TabNode is mounted by React for the root layout.
     */
    private _rootLayoutFactory(node: TabNode): React.ReactNode {
        const componentName = node.getComponent();

        if (componentName) {
            const component = this._components[componentName];
            if (component) {
                return component;
            }
        }

        return (
            <div>
                {node.getName()}
            </div>
        );
    }

    /**
     * Called on the user wants to stop the graph.
     */
    private _handleStop(): void {
        // TODO.
    }

    /**
     * Called on the user wants to start the graph.
     */
    private _handleStart(standalone: boolean): void {
        // TODO.
        standalone;
    }

    /**
     * Called on the user right-clicks on the "play" button.
     */
    private _handlePlayContextMenu(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        ContextMenu.show(
            <Menu className={Classes.DARK}>
                <MenuItem text="Play" icon={<Icon src="play.svg" />} onClick={() => this._handleStart(false)} />
                <MenuItem text="Play Only Current Graph" icon={<Icon src="play.svg" />} onClick={() => this._handleStart(true)} />
            </Menu>,
            { left: e.clientX, top: e.clientY },
        );
    }
}
