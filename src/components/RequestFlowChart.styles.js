import styled from "styled-components";
import img from '../assets/images/actions-icon1.svg';
import img2 from '../assets/images/icon-arrow-right.svg';
import img3 from '../assets/images/icon-arrow-left.svg';
import img4 from '../assets/images/buttons/icon-check.svg';
import img5 from '../assets/images/icon-time.svg';
import img6 from '../assets/images/buttons/close.svg';
import img7 from '../assets/images/warning-icon.svg';

export const OverlayWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1001;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
`;

export const ModalNav = styled.div`
  @media only screen and (max-width: 1024px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    z-index: 3; 
  }
`;

export const Requests = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 150px;
  text-align: center;
  z-index: 3;
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  text-align: center;

    @media only screen and (max-width: 1024px) {
      top: 21px;
    }
`;

export const ArrowRight = styled.div`
    background-color: transparent;
    position: absolute;
    top: 45%;
    right: 25%;
    width: 34px;
    height: 34px;
    font-size: 32px;
    text-align: center;
    line-height: 64px;
    cursor: pointer;
    z-index: 3;
    background-image: url(${img2});
    background-repeat: no-repeat;
    background-position: center;  
    background-size: 15px;   
      @media only screen and (max-width: 1770px) {
        right: 16px;
      }

      @media only screen and (max-width: 1024px) {
        top: 13px;
      }
  `;

export const ArrowLeft = styled.div`
    background-color: transparent;
    position: absolute;
    top: 45%;
    left: 25%;
    width: 34px;
    height: 34px;
    font-size: 32px;
    text-align: center;
    line-height: 64px;
    cursor: pointer;
    z-index: 3;
    background-image: url(${img3});
    background-repeat: no-repeat;
    background-position: center;  
    background-size: 15px;   
      @media only screen and (max-width: 1770px) {
        left: 16px;
      }

      @media only screen and (max-width: 1024px) {
        top: 13px;
      }
  `;

export const ModalCardWrapper = styled.div`
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
  height: 100%;
  z-index: 1001;
`;

export const Flex = styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
padding: 12px 24px 24px 24px;
}
`;

export const Title = styled.div`
position: relative;
color: #201961;
font-weight: 700;
font-size: 20px;
padding-right: 60px;
padding-top: 40px;
  &::before {
    content: "";
    background-image:  url(${img});
    background-size: 16px;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    width: 50px;
    height: 49px;
    position: absolute;
    margin: 0 auto;
    top: 26px;
    right: 0;
    z-index: 2;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &::after {
    content: "";
    background: transparent linear-gradient(180deg, #90ccff 0%, #6486da 100%) 0% 0% no-repeat
    padding-box;
    width: 50px;
    height: 49px;
    border-radius: 50%;
    position: absolute;
    top: 26px;
    right: 0;
    z-index: 1;
    transition: all 0.3s ease;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  }
`;

export const CloseModal = styled.div`  
  cursor: pointer;
  z-index: 4;
  color: #ffffff;
  background-color: #a7abbd;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  box-shadow: 0px 3px 6px rgb(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center; 

  &:hover, &:focus {
    opacity: 0.8;
  }

  &:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: 0 0 0 0.2rem #a6d5fa;
}

  .pi {   
    padding-right: 8px;
}
`;

export const ModalCard = styled.div`
  width: 90%;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  max-width: 826px;  
  margin: 50px auto;
  border-radius: 14px;
  background-color: #ffffff;
`;

export const ModalContent = styled.div`
  position: relative;
  height: auto;
  background-color: #ffffff;
  color: #222f3e;
  z-index: 2;

  .inner-wrap {
    h2 {
        font-size: 16px;
        line-height: 20px;
        color: rgba(32, 25, 97, 0.7);
        padding-bottom: 15px;
    }

    hr {
        border-top: 1px solid #e3def7;
        margin: 0px 0px 15px 0px;
    }

    .hidden {
        display: none;
    }

    .scroll-wrap {
        display: inline;
        scrollbar-color: #e1e0e2 #e4e5e6;
        scrollbar-width: thin;
        max-height: calc(100vh - 178px);
        overflow: auto;

        &::-webkit-scrollbar-track {
            background-color: #e4e5e6;
            border-radius: 30px;
        }

        &::-webkit-scrollbar {
            width: 8px;
            height: 0;
            background-color: #e4e5e6;
            border-radius: 30px;
            background-clip: padding-box;
        }

        &::-webkit-scrollbar-thumb {
            background: #e1e0e2;
            border-radius: 30px;
        }

        @media (max-width: 600px) {
            max-height: calc(100vh - 200px);
        }

        .top-row {
            padding-bottom: 5px;

              @media (max-width: 1023px) {
                align-items: flex-start;
                justify-content: flex-start;
                flex-wrap: wrap;
              }

              @media (max-width: 730px) {
                padding-left: 15px;
                padding-right: 15px;
              }
            }

            p {
                font-size: 14px;
                line-height: 18px;
                font-weight: 400;
                color: rgba(32, 25, 97, 0.7);

                &:first-child {
                  @media (max-width: 1023px) {                   
                    margin-left: 20px;
                  }
                }
              }

           .list {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex: 1;
                border-radius: 24px;
                list-style: none;
                padding: 13px;
                margin: 0 20px;
                background-color: #f4f5fa;

                @media (max-width: 1023px) {
                  order: 3;
                  min-width: 100%;
                  margin: 10px 0px 0px 0px;
                }

                @media (max-width: 700px) {                   
                  padding: 20px 13px;
                }

                @media (max-width: 700px) {                   
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: flex-start;
                }

                li {
                    position: relative;
                    padding-right: 40px;
                    padding-left: 10px;
                    font-size: 14px;
                    line-height: 18px;
                    font-weight: 400;
                    color: rgba(32, 25, 97, 0.7);

                    @media (max-width: 700px) {                   
                      padding-bottom: 24px;
                    }

                    &:last-child {
                      @media (max-width: 700px) {                   
                        padding-bottom: 0px;
                      }
                    }

                    &.FAILED::before {
                        background-image: url(${img7}) !important;
                        background-color: white;
                        top: -5px !important;
                    }
                    
                    &.DENIED::before {
                        background-image: url(${img6}) !important;
                        background-color: red;
                        top: -5px !important;
                    }

                    &::before {
                        content: "";
                        background-image: url(${img4});
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: 15px;
                        background-color: transparent;
                        width: 30px;
                        height: 30px;
                        position: absolute;
                        border-radius: 50%;
                        top: -5px;
                        right: 3px;
                        z-index: 2;
                    }

                    &::after {
                        content: "";
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        position: absolute;
                        top: -5px;
                        right: 3px;
                        z-index: 1;
                        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
                        background: transparent linear-gradient(180deg, #73ca71 0%, #3fbc9d 100%) 0% 0% no-repeat
                            padding-box;
                    }

                    &.DECISION_UNKNOWN, .UNRECOGNIZED {
                        &::after {
                            background: transparent linear-gradient(180deg, #ffffff 0%, #ffffff 100%) 0% 0% no-repeat
                                padding-box;
                        }

                        &::before {
                            background-image: url(${img5});
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: 17px;
                            top: -5px;
                        }
                    }
                    .tooltip {
                        @media (max-width: 700px) {                   
                            min-width: 180px
                        }
                        display: none;
                        position: absolute;
                        top: 27px;
                        right: 5px;
                        z-index: 5;
                        border-radius: 20px;
                        padding: 14px 13px 24px 13px;
                        background-color: #ffffff;
                        box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.3);
                        border-right: 1px solid rgba(0, 0, 0, 0.2);
                        border-top: 1px solid rgba(0, 0, 0, 0.2);
                        min-width: 240px;

                        .inner-list {
                            display: block;
                            margin: 0;
                            background-color: #ffffff;
                            padding: 0px;
                            .items-wrap {
                                position: relative;
                                padding-left: 0px;
                                padding-right: 0px;
                                padding-bottom: 8px;
                                align-items: flex-start;
                                justify-content: flex-start;
                                &::before,
                                &::after {
                                    display: none;
                                }

                                .item {
                                    &:first-child {
                                        margin-left: 15px;
                                        width: 40%;
                                    }

                                    p {
                                        font-size: 12px;
                                        line-height: 16px;

                                        span {
                                            display: inline-block;
                                            padding-left: 6px;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .tooltip-failed {
                        @media (max-width: 700px) {                   
                            min-width: 180px;
                        }
                        display: none;
                        position: absolute;
                        top: 27px;
                        left: -5px;
                        // right: 5px;
                        z-index: 4;
                        border-radius: 20px;
                        padding: 14px 13px 24px 13px;
                        background-color: #ffffff;
                        box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.3);
                        border-right: 1px solid rgba(0, 0, 0, 0.2);
                        border-top: 1px solid rgba(0, 0, 0, 0.2);
                        min-width: 200px;

                        .inner-list-failed {
                            display: block;
                            margin: 0;
                            background-color: #ffffff;
                            padding: 0px;
                            .items-wrap {
                                position: relative;
                                padding-left: 0px;
                                padding-right: 0px;
                                padding-bottom: 8px;
                                align-items: flex-start;
                                justify-content: flex-start;
                                &::before,
                                &::after {
                                    display: none;
                                }

                                .item-failed {
                                    // &:first-child {
                                    //     margin-left: 15px;
                                    //     width: 40%;
                                    // }

                                    p {
                                        font-size: 12px;
                                        line-height: 16px;

                                        span {
                                            display: inline-block;
                                            padding-left: 6px;
                                        }
                                    }
                                }
                            }
                        }
                    }


                    
                    &:hover,
                    &:focus {
                        .tooltip {
                            display: block;
                        }
                        .tooltip-failed {
                            display: block;
                        }
                    }
                }
            }
        }

        .pad-wrap {
            padding: 10px 24px 0px 24px;

            @media (max-width: 730px) {
                padding-left: 15px;
                padding-right: 15px;
            }

            .p-fluid {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                width: 100%;

                @media (max-width: 799px) {
                    flex-direction: column;
                }

                .p-fluid-item {
                    position: relative;

                    width: 50%;
                    @media (max-width: 799px) {
                        width: 100%;
                    }
                    &.p-fluid-item-flex1 {
                        width: 100%;
                        flex-basis: auto;
                    }

                    &.padR {
                        padding-right: 8px;
                        @media (max-width: 799px) {
                            padding-right: 0px;
                        }
                    }

                    &.padL {
                        padding-left: 8px;
                        @media (max-width: 799px) {
                            padding-left: 0px;
                        }
                    }

                    .p-field {
                        label {
                            padding-bottom: 5px;
                        }

                        select,
                        .p-dropdown,
                        input {
                            height: 47px;
                            min-width: inherit;
                        }
                    }

                    .AutoCompleteWrap {
                        label {
                            font-size: 14px;
                            line-height: 18px;
                            color: rgba(32, 25, 97, 0.5);
                            display: block;
                            font-weight: 400;
                            padding-bottom: 5px;
                            .required-field {
                                color: #f68340;
                                display: inline-block;
                                padding-left: 3px;
                            }
                        }

                        .p-autocomplete .p-autocomplete-multiple-container {
                            height: 47px;
                            min-width: inherit;
                            font-size: 14px;
                            font-weight: 500;
                            color: #201961;
                            box-sizing: border-box;
                            padding: 0px 10px;
                            text-align: right;
                            border: 1px solid #e7e8ea;
                            border-radius: 8px;
                            background-color: #fff;
                            font-family: "Heebo", sans-serif;
                            margin: 0px;
                            display: flex;
                            align-items: center;
                            flex-wrap: nowrap;
                            &.p-disabled {
                                background-color: #f7f5fd;
                                border: 1px solid #8390a9;
                                cursor: none;
                                &:hover,
                                &:focus {
                                    border: 1px solid #8390a9;
                                    box-shadow: 0 0 0 0rem #a6d5fa;
                                }

                                &:focus {
                                    box-shadow: 0 0 0 0rem #a6d5fa;
                                }
                            }

                            .p-autocomplete-token {
                                padding: 0 7px 0 0;
                                margin-right: 0rem;
                                margin-left: 18px;
                                background-color: #a7abbd;
                                color: #f7f7f7;
                                border-radius: 50%;
                                width: 35px;
                                height: 35px;

                                &:after {
                                  content: "|";
                                  font-size: 26px;
                                  color: #a7abbd;
                                  border: 0;
                                  position: relative;
                                  left: -11px;
                                }
    
                                &:last-child {
                                    &:after {
                                        display: none;
                                    }
                                }

                              

                                .p-autocomplete-token-label {
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-align: center;
                                    max-width: 20px;
                                    margin: 0 auto;
                                }

                                .p-autocomplete-token-icon {
                                    position: absolute;
                                    top: 7px;
                                    left: 1px;
                                    transform: rotate(45deg);
                                    &:before {
                                      content: '+';
                                      color: #a7abbd;
                                      border: 0;
                                      font-size: 30px;
                                      font-weight: 700;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        .buttons-wrap {
          padding: 22px 24px 35px 24px;
          @media (max-width: 730px) {
              padding-left: 15px;
              padding-right: 15px;
          }
      
          .btn-orange-gradient,
          .btn-green-gradient,
          .icon-note {
              @media (max-width: 460px) {
                  width: 72px;
                  min-width: 72px;
              }
              span {
                  @media (max-width: 460px) {
                      display: none;
                  }
              }
      
              &::before {
                  @media (max-width: 460px) {
                      width: 72px;
                      right: 0px;
                      left: 0;
                      margin: 0 auto;
                  }
              }
      
              &.btn-green-gradient {
                  margin-right: 8px;
              }
          }
        }

        .add-comment-wrap {
            padding: 22px 24px 35px 24px;
            background-color: #f7f7f7;
            border-top: 1px solid #E3DEF7;
            @media (max-width: 730px) {
                padding-left: 15px;
                padding-right: 15px;
            }
            .btn-underline {
                margin-left: 19px;
            }
        }
    }
}
`;