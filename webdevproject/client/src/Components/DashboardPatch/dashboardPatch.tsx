import React from 'react';

interface DashboardPatchProps {
    backToHome: () => void;
}

export class DashboardPatch extends React.Component<DashboardPatchProps> {
    render(): React.ReactNode {
        return (
            <div>
                <h1>Dashboard Patch</h1>
                <p>Welcome to the Dashboard Patch component!</p>
                <button onClick={this.props.backToHome}>Back</button>
            </div>
        );
    }
};

