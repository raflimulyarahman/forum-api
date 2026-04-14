
const NewReply = require('../NewReply');

describe('NewReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(() => new NewReply({})).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    expect(() => new NewReply({ content: 123 })).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    const payload = { content: 'sebuah balasan' };
    const { content } = new NewReply(payload);
    expect(content).toEqual(payload.content);
  });
});
