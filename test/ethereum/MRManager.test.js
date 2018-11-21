const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledMRM = require('../../ethereum/build/MRManager.json');

let accounts;
let meetingRoomMngr;


async function expectThrowHelper(promise) {
  try {
        await promise;
  } catch (error) {
    const invalidJump = error.message.search('invalid JUMP') >= 0;
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('revert cannot cancel this reservation') >=0;
    assert(
      invalidJump || outOfGas || revert,
      "Expected throw, got '" + error + "' instead",
    );
    return;
  }
  assert.fail('Expected throw not received');
};


beforeEach(async ()=>{
  //get ganache accounts
  //by default we have 10 different accounts
  accounts = await web3.eth.getAccounts();

  //deploy factory contract
  meetingRoomMngr = await new web3.eth.Contract(JSON.parse(compiledMRM.interface))
    .deploy({
      data: compiledMRM.bytecode,
      arguments: ['20','10', accounts[0], accounts.slice(0, 1) ]
     })
    .send({ from: accounts[0], gas: '1500000' });
});



describe('MeetingRoomManager', ()=> {
  it('deploys a meetingRoomManager', () => {
    assert.ok(meetingRoomMngr.options.address);
  });

  it('allows people to schedule a meeting', async () => {
    await meetingRoomMngr.methods.reserveRoom(1, 1, 'abc123').send({
      gas: '6500000', gasPrice: web3.utils.toWei('2','gwei'),
      from:accounts[0]
    });

    var roomCalendar1 = await meetingRoomMngr.methods.getRoomAvailability(1).call();
    assert.equal(roomCalendar1.reservedTimeSlots[0], '1');
  });

  it('allows people to reserve and cancel a meeting', async () => {
    await meetingRoomMngr.methods.reserveRoom(1, 1, 'abc123').send({
      gas: '6500000', gasPrice: web3.utils.toWei('2','gwei'),
      from: accounts[0]
    });

    await meetingRoomMngr.methods.cancelReservation(1, 1, 'abc123').send({
      gas: '6500000', gasPrice: web3.utils.toWei('2','gwei'),
      from:accounts[0]
    });

    const room1Calendar = await meetingRoomMngr.methods.getRoomAvailability(1).call();
    console.log(room1Calendar)
    assert.equal(room1Calendar.reservedTimeSlots.length, 0);
  });

  it('does not allows people to cancel a meeting of other people', async () => {
    await meetingRoomMngr.methods.reserveRoom(1, 1, 'abc123').send({
      gas: '6500000', gasPrice: web3.utils.toWei('2','gwei'),
      from:accounts[0]
    });

    await expectThrowHelper(meetingRoomMngr.methods.cancelReservation(1, 1, 'abc456').send({
      gas: '6500000', gasPrice: web3.utils.toWei('2','gwei'),
      from:accounts[0]
    }));

    const room1Calendar = await meetingRoomMngr.methods.getRoomAvailability(1).call();
    assert.equal(room1Calendar.reservedTimeSlots[0], '1');
  });

  it('allows getting reservations per user', async () => {
    await meetingRoomMngr.methods.reserveRoom(1, 1, 'abc123').send({
      gas: '6500000', gasPrice: web3.utils.toWei('2','gwei'),
      from:accounts[0]
    });

    await meetingRoomMngr.methods.reserveRoom(1, 2, 'abc456').send({
      gas: '6500000', gasPrice: web3.utils.toWei('2','gwei'),
      from:accounts[0]
    });

    const reservations = await meetingRoomMngr.methods.getReservations(1, 'abc123').call();
    assert.equal(reservations.roomID, 1);
    assert.equal(reservations.reservations[0], '1');
  });
});
