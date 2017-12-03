/* eslint-disable react/no-children-prop */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Editor } from '@pubpub/editor';
import HighlightMenu from '@pubpub/editor/addons/HighlightMenu';
import Image from '@pubpub/editor/addons/Image';
import ScrollBar from 'components/ScrollBarAddon/ScrollBarAddon';
import DiscussionAddon from 'components/DiscussionAddon/DiscussionAddon';
import { s3Upload, getResizedUrl } from 'utilities';

const bookContent = require('bookSourceEditor.json');
require('./book.scss');

const propTypes = {
	location: PropTypes.object.isRequired,
	lensesData: PropTypes.object.isRequired,
};

const contextTypes = {
	router: PropTypes.object,
	store: PropTypes.object,
};

class Book extends Component {
	render() {
		const lensesData = this.props.lensesData.data || [];
		return (
			<div className={'book'}>
				<style>
					{lensesData.map((lens)=> {
						return `.pt-tag.${lens.slug} { background-color: ${lens.color}; } `;
					})}
				</style>

				<div className={'book-wrapper'}>
					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>
								{/* <h1>Frankenstein Header Content</h1> */}
							</div>
						</div>
					</div>

					<div className={'book-content'}>
						<Editor
							initialContent={bookContent}
							isReadOnly={true}
						>
							<ScrollBar toc={this.toc} documentClassName={'book-wrapper'} />
							<Image
								handleFileUpload={s3Upload}
								handleResizeUrl={(url)=> { return getResizedUrl(url, 'fit-in', '800x0'); }}
							/>
							<DiscussionAddon
								routerContext={this.context.router}
								storeContext={this.context.store}
							/>
							<HighlightMenu
								highlights={[]}
								primaryEditorClassName={'book-content'}
								hoverBackgroundColor={'aqua'}
							/>
						</Editor>
					</div>
				</div>
			</div>

		);
	}
}

Book.propTypes = propTypes;
Book.contextTypes = contextTypes;
export default withRouter(connect(state => ({
	discussionsData: state.discussions,
	lensesData: state.lenses,
	loginData: state.login
}))(Book));
