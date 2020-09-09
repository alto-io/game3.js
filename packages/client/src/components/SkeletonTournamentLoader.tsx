import React, { Component } from 'react';
import { Card } from 'rimble-ui';
import styled from 'styled-components';

const SkeletonCard = styled(Card)`
  border-radius: 15px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1.75rem 1.5rem;

  .skeleton-img,
  .skeleton-prize,
  .skeleton-btn {
    background: #eee;
    width: 100%;
    overflow: hidden;
  }
  
  .skeleton-img {
    border-radius: 15px;
    height: 170px;
    margin-bottom: 2rem;
  }

  .skeleton-prize {
    height: 50px;
    margin-bottom: 2rem;
  }

  .skeleton-btn {
    border-radius: 10px;
    width: 130px;
    height: 50px;
    margin-bottom: 0.825rem;
  }

  .skeleton {
    height: 100%;
    transform: translateX(100%);
    animation: 1s leftToRight linear infinite;
  }

  .skeleton-loader {
    background: #e0e0e0;
    box-shadow: 0 0 20px 20px #e0e0e0;
    width: 20px;
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

class SkeletonTournamentLoader extends Component {
  render(){
    return(
      <SkeletonCard>
        <div className="skeleton-img">
          <div className="skeleton">
            <div className="skeleton-loader"></div>
          </div>
        </div>
        <div className="skeleton-prize">
          <div className="skeleton">
            <div className="skeleton-loader"></div>
          </div>
        </div>
        <div className="skeleton-btn">
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
    )
  }
}

export default SkeletonTournamentLoader;