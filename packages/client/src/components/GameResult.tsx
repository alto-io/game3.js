import * as React from 'react'

import { RouteComponentProps } from '@reach/router'

import Modal from './Modal'

interface IProps extends RouteComponentProps {
  show?: boolean;
  onToggle?: any;
}

export default class GameResult extends React.Component<IProps> {
  render () {
    const { show, onToggle } = this.props
    return (
      <Modal show={show} toggleModal={onToggle}>
        <div>Game result</div>
      </Modal>
    )
  }
}