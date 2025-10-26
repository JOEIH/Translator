export default class Component {
  $target;
  state;
  $element;
  constructor({ $target, ...props }) {
    this.$target = $target;
    this.props = props;
    this.setup();
    this.render();
  }
  setup() {}
  template() {
    return '';
  }
  render() {
    // this.$target.insertAdjacentHTML('afterend', this.template());
    this.setEvent();
  }
  setEvent() {}
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
}
