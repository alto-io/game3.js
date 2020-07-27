import React from "react";
import { shallow, mount } from "enzyme";
import TransactionToastUtil from "./TransactionToastUtil";

const firstTxProps = {
  tx1551107396364: {
    created: 1551107396364,
    lastUpdated: 1551107430741,
    status: "success",
    confirmationCount: 24,
    method: "incrementCounter",
    type: "contract",
    transactionHash:
      "0x18c56dc171eb8e6f95d0489c8e18a8fde95ee1b8350a624abaa17d2872894f41",
    recentEvent: "receipt"
  }
};

const noTxProps = {};

const componentProps = {
  tx1551107396364: {
    created: 1551107396364,
    lastUpdated: 1551107430741,
    status: "success",
    confirmationCount: 24,
    method: "incrementCounter",
    type: "contract",
    transactionHash:
      "0x18c56dc171eb8e6f95d0489c8e18a8fde95ee1b8350a624abaa17d2872894f41",
    recentEvent: "receipt"
  },
  tx1551107423018: {
    created: 1551107423018,
    lastUpdated: 1551107462155,
    status: "success",
    confirmationCount: 24,
    method: "incrementCounter",
    type: "contract",
    transactionHash:
      "0xfe92a2e59ef090df835b48a3795eb4f80e8673b0ce1ce3f4aa060dcbc6a26f7a",
    recentEvent: "receipt"
  },
  tx1551107428376: {
    created: 1551107428376,
    lastUpdated: 1551107462064,
    status: "success",
    confirmationCount: 24,
    method: "incrementCounter",
    type: "contract",
    transactionHash:
      "0xb3f476d68a7148de593bf758d9a449ffbb2da994f14ae0e97695872432d94908",
    recentEvent: "receipt"
  },
  tx1551107627514: {
    created: 1551107627514,
    lastUpdated: 1551107631111,
    status: "pending",
    confirmationCount: 0,
    method: "incrementCounter",
    type: "contract"
  }
};

const updatedProps = {
  tx1551107396364: {
    created: 1551107396364,
    lastUpdated: 1551107430741,
    status: "success",
    confirmationCount: 24,
    method: "incrementCounter",
    type: "contract",
    transactionHash:
      "0x18c56dc171eb8e6f95d0489c8e18a8fde95ee1b8350a624abaa17d2872894f41",
    recentEvent: "receipt"
  },
  tx1551107423018: {
    created: 1551107423018,
    lastUpdated: 1551107462155,
    status: "success",
    confirmationCount: 24,
    method: "incrementCounter",
    type: "contract",
    transactionHash:
      "0xfe92a2e59ef090df835b48a3795eb4f80e8673b0ce1ce3f4aa060dcbc6a26f7a",
    recentEvent: "receipt"
  },
  tx1551107428376: {
    created: 1551107428376,
    lastUpdated: 1551107462064,
    status: "success",
    confirmationCount: 24,
    method: "incrementCounter",
    type: "contract",
    transactionHash:
      "0xb3f476d68a7148de593bf758d9a449ffbb2da994f14ae0e97695872432d94908",
    recentEvent: "receipt"
  },
  tx1551107627514: {
    created: 1551107627514,
    lastUpdated: 1551107639999,
    status: "pending",
    confirmationCount: 0,
    method: "incrementCounter",
    type: "contract"
  }
};

const changedStatusProps = {
  tx1551107396364: {
    created: 1551107396364,
    lastUpdated: 1551107430741,
    status: "success",
    confirmationCount: 24,
    method: "incrementCounter",
    type: "contract",
    transactionHash:
      "0x18c56dc171eb8e6f95d0489c8e18a8fde95ee1b8350a624abaa17d2872894f41",
    recentEvent: "receipt"
  },
  tx1551107423018: {
    created: 1551107423018,
    lastUpdated: 1551107462155,
    status: "success",
    confirmationCount: 24,
    method: "incrementCounter",
    type: "contract",
    transactionHash:
      "0xfe92a2e59ef090df835b48a3795eb4f80e8673b0ce1ce3f4aa060dcbc6a26f7a",
    recentEvent: "receipt"
  },
  tx1551107428376: {
    created: 1551107428376,
    lastUpdated: 1551107462064,
    status: "success",
    confirmationCount: 24,
    method: "incrementCounter",
    type: "contract",
    transactionHash:
      "0xb3f476d68a7148de593bf758d9a449ffbb2da994f14ae0e97695872432d94908",
    recentEvent: "receipt"
  },
  tx1551107627514: {
    created: 1551107627514,
    lastUpdated: 1551107688888,
    status: "success",
    confirmationCount: 0,
    method: "incrementCounter",
    type: "contract"
  }
};

const singleTx = {
  created: 1551107396364,
  lastUpdated: 1551107430741,
  status: "success",
  confirmationCount: 24,
  method: "incrementCounter",
  type: "contract",
  transactionHash:
    "0x18c56dc171eb8e6f95d0489c8e18a8fde95ee1b8350a624abaa17d2872894f41",
  recentEvent: "receipt"
};

describe("TransactionToastUtil initial tests", () => {
  it("accepts transactions prop", () => {
    const wrapper = shallow(
      <TransactionToastUtil transactions={componentProps} />
    );
    expect(wrapper.instance().props.transactions).toEqual(componentProps);
  });

  it("updates transactions prop", () => {
    // Set initial transactions prop
    const wrapper = shallow(
      <TransactionToastUtil transactions={componentProps} />
    );

    // Update transactions prop
    wrapper.setProps({ transactions: updatedProps });

    const instance = wrapper.instance();

    // instance.processTransactionUpdates(componentProps);
    // Verify that props are updated
    expect(instance.props.transactions).toEqual(updatedProps);
  });
});

describe("TransactionToastUtil unit tests", () => {
  it("tests function collectionHasNewObject", () => {
    const wrapper = shallow(
      <TransactionToastUtil transactions={componentProps} />
    );

    const instance = wrapper.instance();

    let results = instance.collectionHasNewObject(componentProps, updatedProps);
    expect(results).toEqual(false);

    results = instance.collectionHasNewObject(noTxProps, firstTxProps);
    expect(results).toEqual(true);
  });

  it("tests function getNewObjectFromCollection", () => {
    const wrapper = shallow(
      <TransactionToastUtil transactions={componentProps} />
    );

    const instance = wrapper.instance();
    let results = instance.getNewObjectFromCollection(noTxProps, firstTxProps);
    expect(results.created).toBe(1551107396364);
  });

  it("tests function getUpdatedObjectFromCollection", () => {
    const wrapper = shallow(
      <TransactionToastUtil transactions={componentProps} />
    );

    const instance = wrapper.instance();
    let results = instance.getUpdatedObjectFromCollection(
      componentProps,
      updatedProps
    );
    expect(results.created).toBe(1551107627514);
  });

  it("tests function getTransactionFromCollection", () => {
    const wrapper = shallow(
      <TransactionToastUtil transactions={componentProps} />
    );

    const instance = wrapper.instance();
    let results = instance.getTransactionFromCollection(
      "1551107627514",
      updatedProps
    );
    expect(results.created).toBe(1551107627514);
  });

  it("tests function getUpdatedTransaction", () => {
    const wrapper = shallow(
      <TransactionToastUtil transactions={componentProps} />
    );

    const instance = wrapper.instance();
    let results = instance.getUpdatedTransaction(noTxProps, firstTxProps);
    expect(results.created).toBe(1551107396364);

    results = instance.getUpdatedTransaction(componentProps, updatedProps);
    expect(results).toBe(null);

    results = instance.getUpdatedTransaction(
      componentProps,
      changedStatusProps
    );
    expect(results.created).toBe(1551107627514);
  });

  it("tests function getTransactionToastMeta", () => {
    const wrapper = shallow(
      <TransactionToastUtil transactions={componentProps} />
    );

    const instance = wrapper.instance();
    let results = instance.getTransactionToastMeta(singleTx);
    expect(results.message).toBe("Smart contract value changed");
  });
});
