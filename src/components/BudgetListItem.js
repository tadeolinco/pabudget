import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { withBudget } from '../context/BudgetContext';
import { COLORS, FONT_SIZES, toCurrency } from '../utils';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 14,
    paddingBottom: 14,
    flexDirection: 'row',
    borderBottomColor: COLORS.GRAY,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  numberContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.TINY,
  },
  hide: {
    position: 'absolute',
    top: 0,
    opacity: 0,
    zIndex: 0,
  },
});

class BudgetListItem extends Component {
  static propTypes = {
    _id: PropTypes.string,
    groupId: PropTypes.string,
    name: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    available: PropTypes.number.isRequired,
    header: PropTypes.bool,
    last: PropTypes.bool,
    budgetContext: PropTypes.object.isRequired,
  };

  static defaultProps = {
    header: false,
    last: false,
  };

  state = {
    tempBudget: this.props.budget.toString(),
    isFocused: false,
  };

  handlePressBudget = () => {
    if (!this.props.header) {
      this.setState({
        isFocused: true,
        tempBudget: this.props.budget.toString(),
      });
      this.input.focus();
    }
  };

  handleChangeBudget = text => {
    const currentLength = this.state.tempBudget.length;
    if (text.length < currentLength) {
      this.setState({ tempBudget: this.state.tempBudget.slice(0, -1) });
    } else {
      const lastCharacter = text[text.length - 1];
      if (isNaN(+lastCharacter) || lastCharacter === ' ') return;
      this.setState({ tempBudget: this.state.tempBudget + lastCharacter });
    }
  };

  handleBlurBudget = () => {
    this.props.budgetContext.updateBudgetItem(
      this.props.groupId,
      this.props._id,
      { budget: +this.state.tempBudget }
    );
    this.setState({ isFocused: false });
  };

  render() {
    const { header, last, name, budget, available } = this.props;
    return (
      <View style={[styles.container, { borderBottomWidth: last ? 0 : 1 }]}>
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.text,
              {
                fontWeight: header ? 'bold' : 'normal',
              },
            ]}
          >
            {name}
          </Text>
        </View>
        <View
          style={styles.numberContainer}
          onTouchStart={this.handlePressBudget}
        >
          <Text
            style={[
              styles.text,
              {
                fontWeight: header ? 'bold' : 'normal',
                color: this.state.isFocused
                  ? +this.state.tempBudget === 0
                    ? COLORS.GRAY
                    : +this.state.tempBudget > 0
                      ? COLORS.BLUE
                      : COLORS.RED
                  : budget === 0
                    ? COLORS.GRAY
                    : budget > 0
                      ? COLORS.BLUE
                      : COLORS.RED,
                zIndex: 1,
              },
            ]}
          >
            {toCurrency(this.state.isFocused ? this.state.tempBudget : budget)}
          </Text>

          <TextInput
            ref={input => (this.input = input)}
            style={styles.hide}
            keyboardType="numeric"
            value={this.state.tempBudget}
            onChangeText={this.handleChangeBudget}
            onBlur={this.handleBlurBudget}
          />
        </View>
        <View style={[styles.numberContainer]}>
          <Text
            style={[
              styles.text,
              {
                fontWeight: header ? 'bold' : 'normal',
                color: COLORS.WHITE,
                backgroundColor:
                  available === 0
                    ? COLORS.GRAY
                    : available > 0
                      ? COLORS.GREEN
                      : COLORS.RED,
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 2,
              },
            ]}
          >
            {toCurrency(available)}
          </Text>
        </View>
      </View>
    );
  }
}

export default withBudget(BudgetListItem);
