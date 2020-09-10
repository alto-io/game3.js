import React, { Component } from 'react';
import { Card } from 'rimble-ui';
import styled from 'styled-components';

const SkeletonCard = styled(Card)`
  border-radius: 15px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0;

  .skeleton-img,
  .skeleton-text,
  .skeleton-btn,
  .skeleton-results {
    background: #eee;
    width: 100%;
    overflow: hidden;
  }
  
  .skeleton-img {
    border-radius: 15px 15px 0 0;
    height: 70px;
    margin-bottom: 2rem;
  }

  .skeleton-text {
    border-radius: 10px;
    height: 50px;
    width: 80%;
    margin-bottom: 2rem;
  }

  .skeleton-results {
    border-radius: 10px;
    height: 150px;
    width: 80%;
    margin-bottom: 2rem;
  }

  .skeleton-btn {
    border-radius: 10px;
    width: 100%;
    height: 60px;
    margin-top: 1rem;
  }

  .skeleton {
    height: 100%;
    transform: translateX(100%);
    animation: 600ms leftToRight linear infinite;
  }

  .skeleton-loader {
    background: #e0e0e0;
    box-shadow: 0 0 30px 30px #e0e0e0;
    width: 30px;
    height: 100%;
  }

  @keyframes leftToRight{
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }
`

class SkeletonLeaderboardLoader extends Component {
  render(){
    return(
      <>
      <SkeletonCard>
        <div className="skeleton-img">
          <div className="skeleton">
            <div className="skeleton-loader"></div>
          </div>
        </div>
        <div className="skeleton-text">
          <div className="skeleton">
            <div className="skeleton-loader"></div>
          </div>
        </div>
        <div className="skeleton-results">
          <div className="skeleton">
            <div className="skeleton-loader"></div>
          </div>
        </div>
        <div className="skeleton-btn">
          <div className="skeleton">
            <div className="skeleton-loader"></div>
          </div>
        </div>
      </SkeletonCard>
      </>
    )
  }
}

export default SkeletonLeaderboardLoader;