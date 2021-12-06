import { Nullable } from "../../../shared/types";

import * as React from "react";
import { NonIdealState, Icon as BPIcon, H4 } from "@blueprintjs/core";

import { ISize } from "babylonjs";

import { GraphNode } from "../../editor/graph/node";

import { IObjectInspectorProps } from "../../editor/components/inspector";
import { AbstractInspector } from "../../editor/components/inspectors/abstract-inspector";

export interface IGraphInspectorState {
	/**
	 * Defines the reference to the selected node.
	 */
	selectedNode: Nullable<GraphNode>;
}

export class GraphInspector extends AbstractInspector<GraphNode, IGraphInspectorState> {
	public constructor(props: IObjectInspectorProps) {
		super(props);

		this.state = {
			selectedNode: null,
		};
	}

	/**
	 * Resizes the inspector.
	 * @param size defines the new size of the panel.
	 * @override
	 */
	public resize(size?: ISize): void {
		if (!this._inspectorDiv) { return; }

		size = size ?? this.editor.getRootPanelSize("inspector");
		this._inspectorDiv.style.height = `${size.height - 100}px`;
	}

	/**
	 * Renders the content of the inspector.
	 */
	public renderContent(): React.ReactNode {
		if (!this.selectedObject) {
			return this._getNonIdealState();
		}

		return (
			<div>
				Coucou
			</div>
		);
	}

	/**
	 * Returns the non ideal state component when no node is selected.
	 */
	private _getNonIdealState(): React.ReactNode {
		return (
			<NonIdealState
				icon={<BPIcon icon="select" size={64} color="white" />}
				title={<H4 style={{ color: "white" }}>No node selected.</H4>}
			/>
		);
	}
}
