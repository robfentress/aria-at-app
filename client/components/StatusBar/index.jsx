import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Button, ButtonGroup } from 'react-bootstrap';
import { Octicon, Octicons } from 'octicons-react';
import nextId from 'react-id-generator';
import { getConflictsByCycleId, getIssuesByTestId } from '../../actions/cycles';

class StatusBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statuses: [
                /*
            {
                action: null,
                icon: 'info',
                message: '',
                variant: 'info',
                visible: false
            }
             */
            ]
        };
    }

    async componentDidMount() {
        const { cycle, dispatch, test, tests, user } = this.props;
        let { statuses } = this.state;

        await dispatch(getIssuesByTestId(test.id));
        // TODO: Make these actually do something
        await dispatch(getConflictsByCycleId(cycle.Id));

        if (this.props.issues.length) {
            let variant = 'warning';
            let action = (
                <Button
                    className="ml-2"
                    variant={variant}
                    onClick={this.props.handleRaiseIssueClick}
                >
                    Review issues
                </Button>
            );
            let icon = 'alert';
            let message = 'This test has open issues.';
            statuses.push({
                action,
                icon,
                message,
                variant
            });
        }

        // TODO: Not implemented
        if (this.props.conflicts.length) {
            let variant = 'warning';
            let action = (
                <Button variant={variant} onClick={this.props.handleRedoClick}>
                    Re-do Test
                </Button>
            );
            let icon = 'alert';
            let message = 'This test has conflicting results.';
            statuses.push({
                action,
                icon,
                message,
                variant
            });
        }

        const result =
            test.results &&
            Object.values(test.results).find(
                ({ test_id, user_id }) =>
                    test_id === test.id && user_id === user.id
            );

        if (result && result.status === 'complete') {
            let variant = 'info';
            let action = (
                <ButtonGroup className="ml-2">
                    {this.props.testIndex > 1 ? (
                        <Button
                            variant={variant}
                            onClick={this.props.handlePreviousTestClick}
                        >
                            Previous
                        </Button>
                    ) : null}
                    <Button
                        className="ml-2"
                        variant={variant}
                        onClick={this.props.handleCloseRunClick}
                    >
                        Close
                    </Button>
                    {this.props.testIndex < tests.length ? (
                        <Button
                            variant={variant}
                            onClick={this.props.handleNextTestClick}
                        >
                            Next test
                        </Button>
                    ) : null}
                </ButtonGroup>
            );
            let icon = 'info';
            let message = 'This test is complete.';
            statuses.push({
                action,
                icon,
                message,
                variant
            });
        }

        this.setState({
            statuses
        });
    }

    render() {
        const { statuses } = this.state;
        return statuses.map(({ action, icon, message, variant }) => {
            return (
                <Alert key={nextId()} variant={variant}>
                    <Octicon icon={Octicons[icon]} /> {message}
                    {action}
                </Alert>
            );
        });
    }
}

StatusBar.propTypes = {
    conflicts: PropTypes.array,
    cycle: PropTypes.object,
    cycleId: PropTypes.number,
    dispatch: PropTypes.func,
    issues: PropTypes.array,
    run: PropTypes.object,
    test: PropTypes.object,
    testIndex: PropTypes.number,
    tests: PropTypes.array,
    user: PropTypes.object,
    handleCloseRunClick: PropTypes.func,
    handleNextTestClick: PropTypes.func,
    handlePreviousTestClick: PropTypes.func,
    handleRaiseIssueClick: PropTypes.func,
    handleRedoClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
    const {
        cycles: { cyclesById, issuesByTestId, testsByRunId },
        user
    } = state;
    const cycle = cyclesById[ownProps.cycleId] || {};
    const issues = (issuesByTestId[ownProps.test.id] || []).filter(
        ({ closed }) => !closed
    );

    // These are placeholders for the next
    // iteration of this component.
    const conflicts = [];
    const tests = testsByRunId[ownProps.run.id];

    return { conflicts, cycle, issues, tests, user };
};
export default connect(mapStateToProps, null)(StatusBar);