import React, { Component } from 'react';
import { Card } from 'rimble-ui';
import styled from 'styled-components';

const SkeletonCard = styled(Card)`
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 1rem;

  .skeleton-img,
  .skeleton-text,
  .skeleton-details {
    background: #eee;
    overflow: hidden;
  }
  
  .skeleton-img {
    border-radius: 15px;
    width: 270px;
    height: 170px;
    margin-bottom: 1rem;
  }

  .skeleton-text {
    height: 30px;
    margin-bottom: 1rem;
    width: 150px;
  }

  .skeleton-details {
    height: 100px;
    margin-bottom: 1rem;
    width: 100%;
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

  @media screen and (min-width: 640px) {
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;

    .skeleton-img {
      margin-bottom: 0;
      margin-right: 2rem;
      width: 185px;
      height: 123px;
    }
  }
`

class SkeletonResultsLoader extends Component {
  render(){
    return(
      <SkeletonCard>
        <div className="skeleton-img">
          <div className="skeleton">
            <div className="skeleton-loader"></div>
          </div>
        </div>
        <div>
          <div className="skeleton-text">
            <div className="skeleton">
              <div className="skeleton-loader"></div>
            </div>
          </div>
          <div className="skeleton-details">
            <div className="skeleton">
              <div className="skeleton-loader"></div>
            </div>
          </div>
        </div>
      </SkeletonCard>
    )
  }
}

export default SkeletonResultsLoader;