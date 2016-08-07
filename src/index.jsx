import React from 'react';

export default class Sortable extends React.Component {
    constructor(args) {
        super(args);
        this.state = { children: this.getChildren(), dragging: null }
    }
    handleMove(child) {
        let {children, dragging} = this.state;
        var pos1 = children.indexOf(dragging);
        var pos2 = children.indexOf(child);

        if (pos1 === -1 || pos2 === -1) {
            ev.preventDefault();
            return false;
        }

        children.splice(pos1, 1);

        children = [].concat(
            children.slice(0, pos2),
            dragging,
            children.slice(pos2)
        );

        this.setState({children});
    }
    startMoving(ev, child) {
        let {children} = this.state;
        let dragging = child;

        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData('element', dragging);

        this.setState({ children, dragging });
    }
    cloneElement(oldChild) {
        let key = oldChild.props.key || ("$k" + (Math.random()));
        let child = React.cloneElement(oldChild, {
            draggable: true,
            onDragOver: ev => this.handleMove(child),
            onDragStart: ev => this.startMoving(ev, child),
        });
        return child;
    }
    getChildren() {
        return React.Children.toArray(this.props.children).map(child => {
            return this.cloneElement(child);
        });
    }
    render() {
        return <div onDragOver={e => e.preventDefault()} onDrop={ ev => {
            this.setState({ dragging: null });
            console.error(ev) 
        }}>
            {this.state.children}
        </div>;
    }
}