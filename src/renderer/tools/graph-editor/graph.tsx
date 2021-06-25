import { readJSON } from "fs-extra";

import { Nullable } from "../../../shared/types";

import * as React from "react";

import { LGraph, LGraphCanvas } from "litegraph.js";

import { Editor } from "../../editor/editor";

import { GraphNode } from "../../editor/graph/node";
import { NodeUtils } from "../../editor/graph/utils";
import { GraphCodeGenerator } from "../../editor/graph/generate";
import { GraphCode } from "../../editor/graph/graph";

export interface IGraphComponentProps {
    /**
     * Defines the reference to the editor.
     */
    editor: Editor;

    /**
     * Defines the absolute path to the graph file.
     */
    graphPath: string;
}

export interface IGraphComponentState {

}

export class GraphComponent extends React.Component<IGraphComponentProps, IGraphComponentState> {
    /**
     * Defines the reference to the graph that contains the nodes.
     */
    public graph: Nullable<LGraph> = null;
    /**
     * Defines the reference to the graph canvas utility that renders the graph.
     */
    public graphCanvas: Nullable<LGraphCanvas> = null;

    private _canvas: Nullable<HTMLCanvasElement> = null;

    /**
     * Renders the component.
     */
    public render(): React.ReactNode {
        return (
            <canvas ref={(r) => this._canvas = r!} style={{ width: "100%", height: "100%", position: "absolute", top: "0" }} />
        );
    }

    /**
     * Called on the component did mount.
     */
    public async componentDidMount(): Promise<void> {
        if (!this._canvas) {
            return;
        }

        GraphCode.Init();
        await GraphCodeGenerator.Init();

        const json = await readJSON(this.props.graphPath, { encoding: "utf-8" });

        this.graph = new LGraph();
        this.graph.configure(json, false);
        this.graph.scene = this.props.editor.scene!;
        this.graph.config["align_to_grid"] = true;
        this._checkGraph();

        this.graphCanvas = new LGraphCanvas(this._canvas, this.graph, {
            autoresize: true,
            skip_render: false,
        });
    }

    /**
     * Returns the list of all available nodes of the given graph.
     * @param graph defines the optional graph where to get all its nodes.
     */
    public getAllNodes(graph?: LGraph): GraphNode[] {
        return (graph ?? this.graph!)["_nodes"] as GraphNode[];
    }

    /**
     * Checks the graph and configures the nodes according to their state.
     */
    private _checkGraph(): void {
        const check = GraphCodeGenerator._GenerateCode(this.graph!);
        if (check.error) {
            check.error.node.color = "#ff2222";
        } else {
            this.getAllNodes().forEach((n) => NodeUtils.SetColor(n));
        }
    }
}
