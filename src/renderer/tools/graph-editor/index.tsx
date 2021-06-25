import { IStringDictionary } from "../../../shared/types";

import * as React from "react";
import { Layout, Model, TabNode } from "flexlayout-react";

import { AbstractEditorPlugin, IEditorPluginProps } from "../../editor/tools/plugin";

import layoutConfiguration from "./layout.json";
import { GraphComponent } from "./graph";

export const title = "Graph Editor";

export default class GraphEditorPlugin extends AbstractEditorPlugin<{}> {
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

        this._components["graph"] = (
            <GraphComponent
                editor={this.editor}
                ref={(r) => this.graphComponent = r!}
                graphPath={props.openParameters.graphPath}
            />
        );
    }

    /**
     * Renders the component.
     */
    public render(): React.ReactNode {
        const layoutModel = Model.fromJson(layoutConfiguration);

        return (
            <Layout model={layoutModel} factory={(n) => this._rootLayoutFactory(n)} />
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
}
